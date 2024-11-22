/**
 * ILogger: Interface for logging functionality.
 *
 * This interface defines the methods required for logging messages, warnings, and errors
 * throughout the application. It allows consistent logging behavior across different modules.
 *
 * ## Methods:
 * - **error**: Logs an error message.
 * - **warn**: Logs a warning message.
 * - **log**: Logs a general informational message.
 */
export interface ILogger {
     /**
      * Logs an error message.
      *
      * @param {string} message - The error message to be logged.
      */
     error(message: string): void;

     /**
      * Logs a warning message.
      *
      * @param {string} message - The warning message to be logged.
      */
     warn(message: string): void;

     /**
      * Logs a general informational message.
      *
      * @param {string} message - The message to be logged.
      */
     log(message: string): void;
}
