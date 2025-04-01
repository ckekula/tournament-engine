/**
 * Interface for JWT payload
 * - sub: User ID
 * - email: User email
 * - roles: User roles
 * - iat: Issued at timestamp (added automatically by JWT)
 * - exp: Expiration timestamp (added automatically by JWT)
 */
export interface JwtPayload {
    /** User ID */
    sub: number;
    
    /** User email */
    email: string;
    
    /** User roles */
    roles: string[];
  }