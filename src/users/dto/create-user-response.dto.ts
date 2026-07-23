import { UserStatus } from '@prisma/client';

export class CreateUserResponseDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  status!: UserStatus;
  emailVerified!: boolean;
}
