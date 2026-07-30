import { UserStatus } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user id
  sid: string; // session id
  email?: string;
  org?: string; // organization
  version?: number;
  iat?: number; // issued at
  exp?: number; // expiration
  isPlatformAdmin: boolean;
}

export type UserContext = {
  id: string;
  email: string;
  status: UserStatus;
};

export type AuthenticatedUserContext = {
  id: string;
  email: string;
  sessionId: string;
  isPlatformAdmin: boolean;
};
