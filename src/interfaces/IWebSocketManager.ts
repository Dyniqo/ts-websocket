import { Application } from 'express';
import { ServerOptions } from 'ws';

import { IMessage } from './IMessage';

/**
 * IWebSocketManagerOptions: Interface for configuring the WebSocket manager.
 *
 * This interface defines the optional configuration properties for setting up the WebSocket manager,
 * including server options, lifecycle hooks, and logging settings.
 *
 * ## Properties:
 * - **port** (number | undefined): The port number for the WebSocket server.
 * - **secretKey** (string | undefined): The secret key used for token generation and authentication.
 * - **tokenExpiry** (string | undefined): The expiration duration for generated tokens.
 * - **enableLogging** (boolean | undefined): Flag to enable or disable logging.
 * - **wsOptions** (ServerOptions | undefined): Additional options for the WebSocket server.
 * - **setupRoutes** (Function | undefined): Callback for setting up application routes.
 * - **beforeSend** (Function | undefined): Hook executed before a message is broadcasted.
 * - **afterSend** (Function | undefined): Hook executed after a message is broadcasted.
 * - **onMessage** (Function | undefined): Custom handler for processing incoming WebSocket messages.
 */
export interface IWebSocketManagerOptions {
     /**
      * The port number for the WebSocket server.
      */
     port?: number;

     /**
      * The secret key used for token generation and authentication.
      */
     secretKey?: string;

     /**
      * The expiration duration for generated tokens (e.g., '1h', '2d').
      */
     tokenExpiry?: string;

     /**
      * Flag to enable or disable logging.
      */
     enableLogging?: boolean;

     /**
      * Additional options for the WebSocket server.
      */
     wsOptions?: ServerOptions;

     /**
      * Callback for setting up application routes.
      *
      * @param {Application} app - The Express application instance.
      */
     setupRoutes?: (app: Application) => void;

     /**
      * Hook executed before a message is broadcasted.
      *
      * @param {IMessage<any>} message - The message being processed.
      */
     beforeSend?: (message: IMessage<any>) => void;

     /**
      * Hook executed after a message is broadcasted.
      *
      * @param {IMessage<any>} message - The message that was processed.
      */
     afterSend?: (message: IMessage<any>) => void;

     /**
      * Custom handler for processing incoming WebSocket messages.
      *
      * @param {IMessage<any>} message - The incoming WebSocket message.
      */
     onMessage?: (message: IMessage<any>) => void;
}

/**
 * IWebSocketManager: Interface for managing the WebSocket server.
 *
 * This interface defines the core functionalities of the WebSocket manager, including
 * starting and stopping the server, and generating authentication tokens.
 *
 * ## Methods:
 * - **start**: Starts the WebSocket server.
 * - **stop**: Stops the WebSocket server.
 * - **generateToken**: Generates a token for a given username.
 */
export interface IWebSocketManager {
     /**
      * Starts the WebSocket server.
      */
     start(): void;

     /**
      * Stops the WebSocket server.
      */
     stop(): void;

     /**
      * Generates a token for a given username.
      *
      * @param {string} username - The username for which the token is generated.
      * @returns {string} - A string representing the generated token.
      */
     generateToken(username: string): string;
}
