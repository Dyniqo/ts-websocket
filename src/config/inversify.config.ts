import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./types";
import { ILogger } from "../interfaces/ILogger";
import { LoggerService } from "../services/LoggerService";
import { IAuthService } from "../interfaces/IAuthService";
import { AuthService } from "../services/AuthService";
import { IWebSocketService } from "../interfaces/IWebSocketService";
import { WebSocketService } from "../services/WebSocketService";
import { WebSocketController } from "../controllers/WebSocketController";
import { IConfig } from "../interfaces/IConfig";
import { Config } from "../utils/Config";

/**
 * Creates and configures a Dependency Injection (DI) container.
 * This container is responsible for managing and injecting dependencies 
 * across the application using the InversifyJS library.
 *
 * @param {Partial<IConfig>} configOptions - Configuration options for initializing the application.
 * @returns {Container} - A configured DI container instance.
 *
 * The function performs the following bindings:
 * - Binds `IConfig` to a dynamic instance of `Config` with the provided configuration options.
 * - Binds `ILogger` to a singleton instance of `LoggerService` for logging functionalities.
 * - Binds `IAuthService` to a singleton instance of `AuthService` for authentication-related operations.
 * - Binds `IWebSocketService` to a singleton instance of `WebSocketService` for WebSocket handling.
 * - Binds `WebSocketController` to a singleton instance for managing WebSocket events and connections.
 *
 * Each dependency is registered with a singleton scope to ensure one shared instance across the application.
 */
export function createContainer(configOptions: Partial<IConfig>): Container {
     const container = new Container();

     container
          .bind<IConfig>(TYPES.IConfig)
          .toDynamicValue(() => new Config(configOptions))
          .inSingletonScope();

     container.bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();

     container
          .bind<IAuthService>(TYPES.IAuthService)
          .to(AuthService)
          .inSingletonScope();

     container
          .bind<IWebSocketService>(TYPES.IWebSocketService)
          .to(WebSocketService)
          .inSingletonScope();

     container
          .bind<WebSocketController>(TYPES.WebSocketController)
          .to(WebSocketController)
          .inSingletonScope();

     return container;
}
