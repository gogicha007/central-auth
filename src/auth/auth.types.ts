import { UserStatus } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user id
  sid: string; // session id
  email?: string;
  org?: string; // organization
  version?: number;
  iat?: number; // issued at
  exp?: number; // expiration
}

export type UserContext = {
  id: string;
  email: string;
  status: UserStatus;
};
