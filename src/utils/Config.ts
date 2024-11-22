import { injectable } from 'inversify';

import { ServerOptions } from 'ws';
import { Application } from 'express';

import { IConfig } from '../interfaces/IConfig';
import { IMessage } from '../interfaces/IMessage';

/**
 * Config: A class implementing the `IConfig` interface to provide configuration settings for the application.
 *
 * This class encapsulates various configuration options, including server settings, lifecycle hooks,
 * and logging preferences. It allows default values to be overridden using a partial configuration object.
 *
 * ## Properties:
 * - **port**: The port number on which the server will run (default: 8080).
 * - **secretKey**: The secret key used for token generation and authentication (default: 'default_secret_key').
 * - **tokenExpiry**: The duration for which generated tokens remain valid (default: '1h').
 * - **wsOptions**: Optional WebSocket server options.
 * - **hooks**: Optional lifecycle hooks for WebSocket message processing.
 * - **enableLogging**: Whether to enable logging (default: `true`).
 * - **setupRoutes**: Optional callback for setting up application routes.
 * - **onMessage**: Optional custom handler for processing incoming WebSocket messages.
 */
@injectable()
export class Config implements IConfig {
     /**
      * The port number on which the server will run.
      *
      * @type {number}
      * @memberof Config
      */
     port: number;

     /**
      * The secret key used for token generation and authentication.
      *
      * @type {string}
      * @memberof Config
      */
     secretKey: string;

     /**
      * The duration for which generated tokens remain valid (e.g., '1h', '2d').
      *
      * @type {string}
      * @memberof Config
      */
     tokenExpiry: string;

     /**
      * Optional WebSocket server options for customizing behavior.
      *
      * @type {ServerOptions}
      * @memberof Config
      */
     wsOptions?: ServerOptions;

     /**
      * Optional lifecycle hooks for processing WebSocket messages.
      *
      * @memberof Config
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
      * Indicates whether logging is enabled. Defaults to `true`.
      *
      * @type {boolean}
      * @memberof Config
      */
     enableLogging?: boolean;

     /**
      * Optional callback for setting up application routes.
      *
      * @param {Application} app - The Express application instance.
      * @memberof Config
      */
     setupRoutes?: (app: Application) => void;

     /**
      * Optional custom handler for processing incoming WebSocket messages.
      *
      * @param {IMessage<any>} message - The incoming WebSocket message.
      * @memberof Config
      */
     onMessage?: (message: IMessage<any>) => void;

     /**
      * Constructor: Initializes the Config class with provided options or defaults.
      *
      * @param {Partial<IConfig>} options - A partial configuration object to override defaults.
      */
     constructor(options: Partial<IConfig> = {}) {
          /**
           * Assign the port, with a default of 8080 if not provided.
           */
          this.port = options.port || 8080;

          /**
           * Assign the secret key, with a default of 'default_secret_key' if not provided.
           */
          this.secretKey = options.secretKey || 'default_secret_key';

          /**
           * Assign the token expiry, with a default of '1h' if not provided.
           */
          this.tokenExpiry = options.tokenExpiry || '1h';

          /**
           * Assign optional WebSocket options.
           */
          this.wsOptions = options.wsOptions;

          /**
           * Assign optional lifecycle hooks for WebSocket messages.
           */
          this.hooks = options.hooks;

          /**
           * Enable or disable logging. Defaults to `true` if not specified.
           */
          this.enableLogging = options.enableLogging ?? true;

          /**
           * Assign optional route setup callback.
           */
          this.setupRoutes = options.setupRoutes;

          /**
           * Assign an optional custom handler for incoming WebSocket messages.
           */
          this.onMessage = options.onMessage;
     }
}
