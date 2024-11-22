import { inject, injectable } from 'inversify';

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

import { TYPES } from '../config/types';
import { ILogger } from '../interfaces/ILogger';
import { IAuthService } from '../interfaces/IAuthService';
import { IWebSocketService } from '../interfaces/IWebSocketService';
import { IMessage } from '../interfaces/IMessage';
import { IConfig } from '../interfaces/IConfig';

/**
 * WebSocketController: A class for managing WebSocket server and client interactions.
 *
 * This controller initializes a WebSocket server, handles client authentication and messaging,
 * and supports custom lifecycle hooks for message processing. It is designed to integrate
 * with dependency-injected services for logging, authentication, and configuration.
 *
 * ## Responsibilities:
 * - Initializes a WebSocket server (`wss`) using provided configuration options.
 * - Manages WebSocket client connections and tracks them in a `Map`.
 * - Authenticates clients using token-based authentication.
 * - Processes and broadcasts messages between connected clients.
 * - Provides hooks for pre-processing and post-processing messages.
 * - Logs key events such as connections, disconnections, and errors.
 *
 * ## Dependencies:
 * - `IWebSocketService`: Provides utility functions for WebSocket operations.
 * - `ILogger`: Handles logging of events and errors.
 * - `IAuthService`: Manages token-based client authentication.
 * - `IConfig`: Supplies configuration for the WebSocket server and hooks.
 */
@injectable()
export class WebSocketController {
     /**
      *
      * @private
      * @type {WebSocketServer}
      * @memberof WebSocketController
      */
     private wss: WebSocketServer;

     /**
      *
      * @private
      * @type {Map<WebSocket, string>}
      * @memberof WebSocketController
      */
     private clients: Map<WebSocket, string> = new Map();

     /**
      *
      * @private
      * @memberof WebSocketController
      */
     private beforeSend?: (message: IMessage<any>) => void;

     /**
      *
      * @private
      * @memberof WebSocketController
      */
     private afterSend?: (message: IMessage<any>) => void;

     /**
      *
      * @private
      * @memberof WebSocketController
      */
     private onMessage?: (message: IMessage<any>) => void;

     /**
      * Constructor: Initializes the WebSocketController and sets up the WebSocket server.
      *
      * @param {IWebSocketService} webSocketService - Utility service for WebSocket operations.
      * @param {ILogger} logger - Logger service for monitoring and debugging.
      * @param {IAuthService} authService - Authentication service for verifying tokens.
      * @param {IConfig} config - Configuration object for WebSocket server and hooks.
      */
     constructor(
          @inject(TYPES.IWebSocketService) private webSocketService: IWebSocketService,
          @inject(TYPES.ILogger) private logger: ILogger,
          @inject(TYPES.IAuthService) private authService: IAuthService,
          @inject(TYPES.IConfig) private config: IConfig
     ) {
          this.wss = new WebSocketServer({ noServer: true, ...this.config.wsOptions });
          this.wss.on('connection', this.onConnection.bind(this));

          this.beforeSend = this.config.hooks?.beforeSend;
          this.afterSend = this.config.hooks?.afterSend;
          this.onMessage = this.config.onMessage;
     }

     /**
      * Dynamically sets lifecycle hooks for message processing.
      *
      * @param {Function} [beforeSend] - Hook executed before a message is broadcasted.
      * @param {Function} [afterSend] - Hook executed after a message is broadcasted.
      */
     public setLifecycleHooks(
          beforeSend?: (message: IMessage<any>) => void,
          afterSend?: (message: IMessage<any>) => void
     ) {
          this.beforeSend = beforeSend;
          this.afterSend = afterSend;
     }

     /**
      * Handles HTTP-to-WebSocket upgrade requests.
      *
      * @param {IncomingMessage} request - The incoming HTTP upgrade request.
      * @param {Socket} socket - The network socket for the connection.
      * @param {Buffer} head - The first packet of the upgraded stream.
      */
     public handleUpgrade(request: IncomingMessage, socket: Socket, head: Buffer): void {
          this.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
               this.wss.emit('connection', ws, request);
          });
     }

     /**
      * Handles a new WebSocket connection, authenticates the client, and sets up event listeners.
      *
      * @private
      * @param {WebSocket} ws - The WebSocket instance for the connected client.
      * @param {IncomingMessage} request - The incoming HTTP request for the connection.
      */
     private onConnection(ws: WebSocket, request: IncomingMessage): void {
          const token = this.extractToken(request.url);
          const username = token ? this.authService.verifyToken(token) : null;

          if (token && !username) {
               ws.send(JSON.stringify({ error: 'Authentication Failed' }));
               ws.close(1008, 'Authentication Failed');
               this.logger.warn('WebSocket connection closed due to failed authentication.');
               return;
          }

          const user = username || 'Anonymous';
          this.clients.set(ws, user);
          this.logger.log(`User connected: ${user}`);

          ws.on('message', (data: string) => {
               let message: IMessage;

               try {
                    message = JSON.parse(data);
                    message.sender = user;
               } catch (error) {
                    this.logger.error(`Error parsing message: ${(error as Error).message}`);
                    ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
                    ws.close();
                    return;
               }

               try {
                    if (this.onMessage) {
                         this.onMessage(message);
                    } else {
                         if (this.beforeSend) {
                              this.beforeSend(message);
                         }

                         this.broadcastMessage(message);

                         if (this.afterSend) {
                              this.afterSend(message);
                         }
                    }
               } catch (error) {
                    this.logger.error(`Error processing message: ${(error as Error).message}`);
                    ws.send(JSON.stringify({ error: 'Internal server error' }));
               }
          });

          ws.on('close', () => {
               this.clients.delete(ws);
               this.logger.log(`User disconnected: ${user}`);
          });

          ws.on('error', (error: Error) => {
               this.logger.error(`WebSocket error: ${error.message}`);
          });
     }

     /**
      * Broadcasts a message to all connected WebSocket clients.
      *
      * @private
      * @param {IMessage<any>} message - The message to be broadcasted.
      */
     private broadcastMessage(message: IMessage<any>): void {
          this.wss.clients.forEach(client => {
               if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
               }
          });
          this.logger.log(`Broadcasted message from ${message.sender}`);
     }

     /**
      * Extracts the token from a WebSocket request URL for authentication.
      *
      * @private
      * @param {string | undefined} url - The URL from which to extract the token.
      * @returns {string | null} - The extracted token or null if not found.
      */
     private extractToken(url: string | undefined): string | null {
          if (!url) return null;
          try {
               const params = new URLSearchParams(url.split('?')[1]);
               return params.get('token');
          } catch {
               return null;
          }
     }

     /**
      * Gracefully shuts down the WebSocket server and logs the closure.
      */
     public close() {
          this.clients.forEach((username, ws) => {
               ws.close(1001, 'Server shutting down');
          });
          this.wss.close(() => {
               this.logger.warn('WebSocket server closed.');
          });
     }
}
