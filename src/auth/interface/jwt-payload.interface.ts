/* eslint-disable prettier/prettier */
// jwt-payload.interface.ts
export interface JwtPayload {
  sub: number; // Assuming user ID is stored in the token
  username: string;
  isAdmin: boolean;
}
