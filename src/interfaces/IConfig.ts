import { Application } from 'express';
import { ServerOptions } from 'ws';

import { IMessage } from './IMessage';

/**
 * IConfig: Interface for application configuration settings.
 *
 * This interface defines the structure of the configuration object required by the application,
 * including server options, lifecycle hooks, and additional customizations.
 *
 * ## Properties:
 * - **port** (number): The port number on which the server will run.
 * - **secretKey** (string): A secret key used for token generation and authentication.
 * - **tokenExpiry** (string): The duration for which generated tokens remain valid.
 * - **wsOptions** (ServerOptions | undefined): Optional WebSocket server options.
 * - **hooks** (object | undefined): Optional lifecycle hooks for WebSocket message processing.
 *   - **beforeSend** (Function | undefined): Hook executed before a message is broadcasted.
 *   - **afterSend** (Function | undefined): Hook executed after a message is broadcasted.
 * - **enableLogging** (boolean | undefined): Flag to enable or disable logging across the application.
 * - **setupRoutes** (Function | undefined): Callback for setting up application routes.
 * - **onMessage** (Function | undefined): Custom handler for processing incoming WebSocket messages.
 */
export interface IConfig {
     /**
      * The port number on which the server will run.
      */
     port: number;

     /**
      * A secret key used for token generation and authentication.
      */
     secretKey: string;

     /**
      * The duration for which generated tokens remain valid (e.g., '1h', '2d').
      */
     tokenExpiry: string;

     /**
      * Optional WebSocket server options.
      */
     wsOptions?: ServerOptions;

     /**
      * Optional lifecycle hooks for WebSocket message processing.
      */
     hooks?: {
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
     };

     /**
      * Flag to enable or disable logging across the application.
      */
     enableLogging?: boolean;

     /**
      * Callback for setting up application routes.
      *
      * @param {Application} app - The Express application instance.
      */
     setupRoutes?: (app: Application) => void;

     /**
      * Custom handler for processing incoming WebSocket messages.
      *
      * @param {IMessage<any>} message - The incoming WebSocket message.
      */
     onMessage?: (message: IMessage<any>) => void;
}
