import "reflect-metadata";
import { IMessage } from "../src/interfaces/IMessage";
import WebSocket from "ws";
import { WebSocketManager } from "../src/WebSocketManager";

describe("WebSocketManager", () => {
     let wsManager: WebSocketManager;
     let clientToken1: string;
     let clientToken2: string;
     const port = 4000;

     beforeAll(() => {
          wsManager = new WebSocketManager({
               port,
               secretKey: "sampleCecretKey",
               enableLogging: true,
          });

          clientToken1 = wsManager.generateToken("client1");
          clientToken2 = wsManager.generateToken("client1");

          wsManager.start();
     });

     afterAll(() => {
          wsManager.stop();
     });

     test("should accept WebSocket connections", async () => {
          const ws = new WebSocket(`ws://localhost:${port}`);

          await new Promise<void>((resolve, reject) => {
               ws.on("open", () => {
                    try {
                         expect(ws.readyState).toBe(WebSocket.OPEN);
                         ws.close();
                         resolve();
                    } catch (err) {
                         reject(err);
                    }
               });

               ws.on("error", (err) => {
                    console.error("WebSocket Error:", err);
                    reject(err);
               });
          });
     });

     test("should receive and broadcast valid messages", async () => {
          const wsClient1 = new WebSocket(`ws://localhost:${port}?token=${clientToken1}`);
          const wsClient2 = new WebSocket(`ws://localhost:${port}?token=${clientToken2}`);

          const testMessage: IMessage = {
               sender: "client1",
               content: "Hello from client 1",
          };

          new Promise<void>((resolve) => {
               wsClient2.on("message", (data) => {
                    const message: IMessage = JSON.parse(data.toString());
                    expect(message.sender).toBe("client1");
                    expect(message.content).toBe("Hello from client 1");
                    wsClient1.close();
                    wsClient2.close();
                    resolve();
               });

               wsClient1.on("open", () => {
                    wsClient1.send(JSON.stringify(testMessage));
               });
          });
     });

     test("should not crash on invalid JSON messages", async () => {
          const ws = new WebSocket(`ws://localhost:${port}`);

          await new Promise<void>((resolve) => {
               ws.on("open", () => {
                    ws.send("Invalid JSON");
               });

               ws.on("close", () => {
                    expect(true).toBe(true);
                    resolve();
               });
          });

          ws.close();
     });

     test("should handle multiple connections gracefully", async () => {
          const clients: WebSocket[] = [];
          const clientCount = 10;

          for (let i = 0; i < clientCount; i++) {
               clients.push(new WebSocket(`ws://localhost:${port}`));
          }

          await Promise.all(
               clients.map(
                    (client) =>
                         new Promise<void>((resolve) => {
                              client.on("open", () => {
                                   expect(client.readyState).toBe(WebSocket.OPEN);
                                   client.close();
                                   resolve();
                              });
                         })
               )
          );
     });

     test("should reject unauthenticated users", async () => {
          const ws = new WebSocket(`ws://localhost:${port}?token=invalid_token`);

          await new Promise<void>((resolve) => {
               ws.on("close", (code) => {
                    expect(code).toBe(1008);
                    resolve();
               });

               ws.on("open", () => {
                    ws.send(JSON.stringify({ sender: "", content: "Test without auth" }));
               });
          });
     });
});
