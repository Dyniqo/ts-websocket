import { injectable, inject } from 'inversify';

import { IWebSocketService } from '../interfaces/IWebSocketService';
import { IMessage } from '../interfaces/IMessage';
import { TYPES } from '../config/types';
import { ILogger } from '../interfaces/ILogger';

/**
 * WebSocketService: A service class for managing WebSocket operations.
 *
 * This service implements the `IWebSocketService` interface and provides functionality
 * for broadcasting messages to connected WebSocket clients.
 *
 * ## Dependencies:
 * - **ILogger**: Used for logging message broadcasting activities.
 *
 * ## Responsibilities:
 * - Logs the broadcasting of messages using the injected logger service.
 */
@injectable()
export class WebSocketService implements IWebSocketService {
     /**
      * Constructor: Initializes the WebSocketService with a logger dependency.
      *
      * @param {ILogger} logger - The logger service for logging operations.
      */
     constructor(@inject(TYPES.ILogger) private logger: ILogger) { }

     /**
      * Logs a message broadcasting activity.
      *
      * @param {IMessage<any>} message - The message to be broadcasted.
      */
     broadcastMessage(message: IMessage<any>): void {
          this.logger.log(`Broadcasting message from ${message.sender}`);
     }
}
