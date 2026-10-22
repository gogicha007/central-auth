import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(err: unknown): never {
  if (err instanceof HttpException) throw err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        throw new ConflictException(
          'A record with these details already exists',
        );
      case 'P2025':
        throw new NotFoundException('Record not found');
      case 'P2003':
      case 'P2014':
        throw new ConflictException(
          'The operation conflicts with related records',
        );
      case 'P2034':
        throw new ConflictException(
          'The operation conflicted with another request; please retry',
        );
      case 'P2024':
      case 'P2037':
        throw new ServiceUnavailableException('Service Unavailable');
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    throw new ServiceUnavailableException('Service Unavailable');
  }

  throw new InternalServerErrorException('Internal Server Error');
}
