import { TokenType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateEmailVerificationTokenDto {
  userId!: string;
  type!: TokenType;
  tokenHash!: string;

  @IsDate()
  @Transform(({ value }) => {
    if (value) return new Date(value);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  })
  expiresAt!: Date;
}
