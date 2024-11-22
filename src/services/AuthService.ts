import { injectable, inject } from 'inversify';

import jwt from 'jsonwebtoken';

import { IAuthService } from '../interfaces/IAuthService';
import { TYPES } from '../config/types';
import { IConfig } from '../interfaces/IConfig';

/**
 * AuthService: A service class for managing authentication.
 *
 * This service implements the `IAuthService` interface and provides functionality
 * for generating and verifying authentication tokens using JSON Web Tokens (JWT).
 *
 * ## Dependencies:
 * - **IConfig**: Provides the secret key and token expiry settings for token management.
 *
 * ## Responsibilities:
 * - Generate JWT tokens for user authentication.
 * - Verify the validity of JWT tokens and extract the associated username.
 */
@injectable()
export class AuthService implements IAuthService {
     private secretKey: string;
     private tokenExpiry: string;

     /**
      * Constructor: Initializes the AuthService with configuration settings.
      *
      * @param {IConfig} config - The configuration object providing the secret key and token expiry.
      */
     constructor(@inject(TYPES.IConfig) private config: IConfig) {
          this.secretKey = this.config.secretKey;
          this.tokenExpiry = this.config.tokenExpiry;
     }

     /**
      * Generates a JWT token for the given username.
      *
      * @param {string} username - The username for which the token is generated.
      * @returns {string} - A JWT token representing the authenticated user.
      */
     generateToken(username: string): string {
          return jwt.sign({ username }, this.secretKey, { expiresIn: this.tokenExpiry });
     }

     /**
      * Verifies the provided JWT token and retrieves the associated username.
      *
      * @param {string} token - The JWT token to verify.
      * @returns {string | null} - The username if the token is valid, or null if invalid.
      */
     verifyToken(token: string): string | null {
          try {
               const decoded = jwt.verify(token, this.secretKey) as { username: string };
               return decoded.username;
          } catch {
               return null;
          }
     }
}
