/**
 * IAuthService: Interface for authentication services.
 *
 * This interface defines the contract for an authentication service, which is responsible 
 * for generating and verifying authentication tokens to ensure secure user access and 
 * identification within the application.
 */
export interface IAuthService {
     /**
      * Generates a secure token for a given username.
      *
      * @param {string} username - The username for which the token will be generated.
      * @returns {string} - A string representing the generated authentication token.
      */
     generateToken(username: string): string;

     /**
      * Verifies the provided token and retrieves the associated username if the token is valid.
      *
      * @param {string} token - The authentication token to be verified.
      * @returns {string | null} - The username associated with the token if valid, or null if invalid.
      */
     verifyToken(token: string): string | null;
}
