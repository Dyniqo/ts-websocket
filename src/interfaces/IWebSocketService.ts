import { IMessage } from './IMessage';

/**
 * IWebSocketService: Interface for WebSocket service operations.
 *
 * This interface defines the methods required for managing WebSocket communication,
 * specifically for broadcasting messages to connected clients.
 *
 * ## Methods:
 * - **broadcastMessage**: Sends a message to all connected WebSocket clients.
 */
export interface IWebSocketService {
     /**
      * Broadcasts a message to all connected WebSocket clients.
      *
      * @param {IMessage<any>} message - The message to be broadcasted.
      */
     broadcastMessage(message: IMessage<any>): void;
}
