import { UserStatus } from '@prisma/client';

export class LoginResponseDto {
  id!: string;
  email!: string;
  status!: UserStatus;
  accessToken?: string;
  expiresIn?: number;
  tokenType?: string;
  isPlatformAdmin!: boolean;
}
