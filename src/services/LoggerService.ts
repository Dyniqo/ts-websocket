import { injectable, inject } from 'inversify';

import { ILogger } from '../interfaces/ILogger';
import { TYPES } from '../config/types';
import { IConfig } from '../interfaces/IConfig';

/**
 * LoggerService: A service class for managing application logging.
 *
 * This service implements the `ILogger` interface and provides methods for logging errors,
 * warnings, and general informational messages. The logging functionality can be controlled
 * through the configuration to enable or disable logging.
 *
 * ## Dependencies:
 * - **IConfig**: Supplies configuration settings, including the `enableLogging` flag.
 *
 * ## Responsibilities:
 * - Logs error messages unconditionally.
 * - Logs warnings and informational messages conditionally, based on the `enableLogging` flag.
 */
@injectable()
export class LoggerService implements ILogger {
     private enableLogging: boolean;

     /**
      * Constructor: Initializes the LoggerService with configuration settings.
      *
      * @param {IConfig} config - The configuration object providing logging settings.
      */
     constructor(@inject(TYPES.IConfig) private config: IConfig) {
          this.enableLogging = this.config.enableLogging ?? true;
     }

     /**
      * Logs an error message.
      *
      * @param {string} message - The error message to log.
      */
     error(message: string): void {
          console.error(`[WS ERROR]: ${message}`);
     }

     /**
      * Logs a warning message if logging is enabled.
      *
      * @param {string} message - The warning message to log.
      */
     warn(message: string): void {
          if (this.enableLogging) {
               console.warn(`[WS WARN]: ${message}`);
          }
     }

     /**
      * Logs an informational message if logging is enabled.
      *
      * @param {string} message - The message to log.
      */
     log(message: string): void {
          if (this.enableLogging) {
               console.log(`[WS LOG]: ${message}`);
          }
     }
}
