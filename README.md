# WebSocket Management Library

A robust and flexible TypeScript library for managing WebSocket connections alongside an HTTP server. This library provides seamless integration into Node.js applications with built-in support for dependency injection, modular design, and extensibility.

---

## 📜 Features

- 🌐 **Unified HTTP and WebSocket Management**: Simplifies handling both HTTP and WebSocket protocols.
- 🧩 **Dependency Injection**: Powered by `inversify` for modular and testable architecture.
- 🛠️ **Highly Extensible**: Offers interfaces and hooks for custom implementations (e.g., authentication, logging).
- 🔌 **Middleware Support**: Easily add HTTP and WebSocket middleware.
- 📝 **TypeScript First**: Fully typed APIs for safer and more productive development.

---

## 📦 Installation

Install the package using npm or yarn:

```bash
npm install @dyniqo/ts-websocket
```
```bash
yarn add @dyniqo/ts-websocket
```

---

## ⚙️ Usage

### 🛠️ Basic Setup

The `WebSocketManager` class is the core component of the library. Here is an example of its usage:

```typescript
import { WebSocketManager } from '@dyniqo/ts-websocket';

// Configuration options
const options = {
  port: 3000,
  enableLogging: true,
};

// Initialize WebSocketManager
const wsManager = new WebSocketManager(options);

// Start the server
wsManager.start().then(() => {
  console.log('WebSocket server is running!');
});
```

---

## 📚 API Documentation

### 🖥️ WebSocketManager

#### 📖 Methods:
- `constructor(options: IWebSocketManagerOptions)`: Initialize the WebSocket manager with configuration.
- `start(): Promise<void>`: Start the HTTP and WebSocket servers.
- `stop(): Promise<void>`: Stop the servers gracefully.
- `onConnection(handler: (socket: WebSocket) => void): void`: Register a handler for new WebSocket connections.

### ⚙️ Configuration Options (IWebSocketManagerOptions)
The `IWebSocketManagerOptions` interface provides configuration properties to customize the WebSocketManager. Below are the available options:

| Property         | Type                               | Default            | Description                                                                                      |
|------------------|------------------------------------|--------------------|--------------------------------------------------------------------------------------------------|
| `port`           | number                            | `8080`             | The port number for the WebSocket server.                                                       |
| `secretKey`      | string                            | `'default_secret'` | Secret key used for token generation and authentication.                                        |
| `tokenExpiry`    | string                            | `'1h'`             | The expiration duration for generated tokens (e.g., '1h', '2d').                                |
| `enableLogging`  | boolean                           | `true`             | Flag to enable or disable logging.                                                              |
| `wsOptions`      | `ServerOptions`                   | `undefined`        | Additional options for the WebSocket server.                                                    |
| `setupRoutes`    | `(app: Application) => void`      | `undefined`        | Callback for setting up application routes in the Express application.                          |
| `beforeSend`     | `(message: IMessage<any>) => void`| `undefined`        | Hook executed before a message is broadcasted.                                                  |
| `afterSend`      | `(message: IMessage<any>) => void`| `undefined`        | Hook executed after a message is broadcasted.                                                   |
| `onMessage`      | `(message: IMessage<any>) => void`| `undefined`        | Custom handler for processing incoming WebSocket messages.                                      |

---

## 🧑‍💻 Usage Example

```typescript
import { WebSocketManager } from '@dyniqo/ts-websocket';

const wsManager = new WebSocketManager({
  port: 8080,
  secretKey: 'anySecretKey',
  tokenExpiry: '2h',
  enableLogging: true,
  beforeSend: (message) => {
    console.log('Before sending message:', message);
  },
  afterSend: (message) => {
    console.log('After sending message:', message);
  },
  onMessage: (message) => {
    console.log('Received message:', message);
  },
  setupRoutes: (app) => {
    app.get('/status', (req, res) => {
      res.send('Server is running!');
    });
  },
});

wsManager.start();
```
---

## 🚀 Advanced Usage

### 🔌 Middleware Integration

Add middleware for HTTP requests or WebSocket connections:

```typescript
wsManager.use((req, res, next) => {
  console.log(`HTTP Request: ${req.method} ${req.url}`);
  next();
});
```

### 🌐 WebSocket Event Handlers

Define handlers for WebSocket events:

```typescript
wsManager.onConnection((socket) => {
  console.log('New connection established.');

  socket.on('message', (msg) => {
    console.log(`Received message: ${msg}`);
    socket.send('Hello, Client!');
  });

  socket.on('close', () => {
    console.log('Connection closed.');
  });

  socket.on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
});
```

---

## 🔄 Lifecycle Hooks

The library provides lifecycle hooks to customize the behavior at different stages:

### 🖥️ Server Lifecycle
```typescript
wsManager.onStart(() => {
  console.log('Server is starting...');
});

wsManager.onStop(() => {
  console.log('Server is shutting down...');
});
```

### ✉️ Message Lifecycle
- **`beforeSend`**: Modify or validate messages before they are sent.
```typescript
wsManager.beforeSend((message, socket) => {
  console.log('Preparing to send message:', message);
  // Modify the message if needed
  return message;
});
```

- **`afterSend`**: Perform actions after a message is sent.
```typescript
wsManager.afterSend((message, socket) => {
  console.log('Message sent:', message);
  // Additional post-send logic here
});
```

---

## 🧪 Testing

Run tests using:

```bash
npm run test
```

---

## 📬 Contact Us

We'd love to hear from you! If you have questions, suggestions, or need support, here are the ways to reach us:

📧 **Email:** [dyniqo@gmail.com](mailto:dyniqo@gmail.com)  
🐛 **GitHub Issues:** [Open an Issue](https://github.com/Dyniqo/ts-websocket/issues)

We look forward to hearing from you!
