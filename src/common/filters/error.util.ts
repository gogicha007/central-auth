import { HttpException } from '@nestjs/common';

export class PrismaException extends HttpException {
  constructor(message: string, status = 400) {
    super({ message: `Prisma error, ${message}` }, status);
  }
}

export function handlePrismaError(err: unknown): never {
  let message = 'Unknown Prisma error';
  if (err instanceof Error) {
    message = err.message;
    if ('code' in err) {
      message += `, ${String(err.code)}`;
    }
  }
  throw new PrismaException(message);
}