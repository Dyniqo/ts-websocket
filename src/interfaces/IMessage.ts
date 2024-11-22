/**
 * IMessage: Interface for WebSocket messages.
 *
 * This interface defines the structure of messages exchanged between WebSocket clients and the server.
 * It is generic, allowing the content of the message to be of any type.
 *
 * ## Properties:
 * - **sender** (string): The identifier of the sender of the message.
 * - **content** (T): The content of the message. The type `T` is generic and defaults to `any`.
 */
export interface IMessage<T = any> {
     /**
      * The identifier of the sender of the message.
      */
     sender: string;

     /**
      * The content of the message. The type is generic and can represent any structure or data.
      */
     content: T;
}
