import 'reflect-metadata';

import express, { Application } from 'express';
import http, { IncomingMessage } from 'http';
import { Socket } from 'net';

import { TYPES } from '../config/types';
import { createContainer } from '../config/inversify.config';
import { IWebSocketManager, IWebSocketManagerOptions } from '../interfaces/IWebSocketManager';
import { ILogger } from '../interfaces/ILogger';
import { IAuthService } from '../interfaces/IAuthService';
import { IWebSocketService } from '../interfaces/IWebSocketService';
import { WebSocketController } from '../controllers/WebSocketController';

/**
 * WebSocketManager: A class for managing WebSocket server and HTTP server interactions.
 *
 * This class is responsible for initializing the HTTP and WebSocket servers, configuring middleware,
 * managing lifecycle hooks, and delegating WebSocket operations to the WebSocketController.
 *
 * ## Responsibilities:
 * - Initializes the HTTP server and Express application.
 * - Configures WebSocket functionality and integrates WebSocketController for handling WebSocket events.
 * - Manages lifecycle hooks for WebSocket message processing.
 * - Provides methods to start, stop the server, and generate authentication tokens.
 *
 * ## Dependencies:
 * - Uses `createContainer` to resolve and inject dependencies including:
 *   - `ILogger`: For logging server and WebSocket events.
 *   - `IAuthService`: For token generation and authentication.
 *   - `IWebSocketService`: For WebSocket operations.
 *   - `WebSocketController`: To handle WebSocket connections and messaging.
 * - Accepts `IWebSocketManagerOptions` to customize behavior and configuration.
 */
export class WebSocketManager implements IWebSocketManager {
     /**
      *
      * @private
      * @type {Application}
      * @memberof WebSocketManager
      */
     private app: Application;

     /**
      *
      * @private
      * @type {http.Server}
      * @memberof WebSocketManager
      */
     private server: http.Server;

     /**
      *
      * @private
      * @type {ILogger}
      * @memberof WebSocketManager
      */
     private logger: ILogger;

     /**
      *
      * @private
      * @type {IAuthService}
      * @memberof WebSocketManager
      */
     private authService: IAuthService;

     /**
      *
      * @private
      * @type {IWebSocketService}
      * @memberof WebSocketManager
      */
     private webSocketService: IWebSocketService;

     /**
      *
      * @private
      * @type {WebSocketController}
      * @memberof WebSocketManager
      */
     private webSocketController: WebSocketController;

     /**
      *
      * @private
      * @type {number}
      * @memberof WebSocketManager
      */
     private port: number;

     /**
      * Constructor: Initializes the WebSocketManager with provided options.
      *
      * @param {IWebSocketManagerOptions} [options={}] - Optional configuration for the WebSocket manager.
      */
     public constructor(private options: IWebSocketManagerOptions = {}) {
          const container = createContainer({
               port: options.port || 8080,
               secretKey: options.secretKey || 'default_secret',
               tokenExpiry: options.tokenExpiry || '1h',
               wsOptions: options.wsOptions,
               hooks: {
                    beforeSend: options.beforeSend,
                    afterSend: options.afterSend,
               },
               enableLogging: options.enableLogging ?? true,
               setupRoutes: options.setupRoutes,
               onMessage: options.onMessage,
          });

          this.logger = container.get<ILogger>(TYPES.ILogger);
          this.authService = container.get<IAuthService>(TYPES.IAuthService);
          this.webSocketService = container.get<IWebSocketService>(TYPES.IWebSocketService);
          this.webSocketController = container.get<WebSocketController>(TYPES.WebSocketController);

          this.app = express();
          this.server = http.createServer(this.app);
          this.port = options.port || 8080;

          this.setupMiddleware();

          if (options.setupRoutes) {
               options.setupRoutes(this.app);
          }

          this.setupWebSocket();

          if (options.beforeSend || options.afterSend) {
               this.webSocketController.setLifecycleHooks(options.beforeSend, options.afterSend);
          }
     }

     /**
      *Configures middleware for the Express application.
      *
      * @private
      * @memberof WebSocketManager
      */
     private setupMiddleware() {
          this.app.use(express.json());
     }

     /**
      * Configures WebSocket upgrade handling and delegates it to WebSocketController.
      *
      * @private
      * @memberof WebSocketManager
      */
     private setupWebSocket() {
          this.server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
               this.webSocketController.handleUpgrade(request, socket, head);
          });
     }

     /**
      * Starts the HTTP server and WebSocket server.
      *
      * @memberof WebSocketManager
      */
     public start() {
          this.server.listen(this.port, () => {
               this.logger.log(`Server is running on port ${this.port}`);
          });
     }

     /**
      * Stops the HTTP server and closes the WebSocket server.
      *
      * @memberof WebSocketManager
      */
     public stop() {
          this.webSocketController.close();
          this.server.close(() => {
               this.logger.log('Server has been stopped.');
          });
     }

     /**
      * Generates an authentication token for the given username.
      *
      * @param {string} username - The username for which the token is generated.
      * @returns {string} - A JWT token representing the authenticated user.
      */
     public generateToken(username: string): string {
          return this.authService.generateToken(username);
     }
}
