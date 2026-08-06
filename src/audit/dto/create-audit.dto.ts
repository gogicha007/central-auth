import { AuditAction, ResourceType } from '@prisma/client';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAuditDto {
  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  action!: AuditAction;

  @IsString()
  resource!: ResourceType;

  @IsOptional()
  @IsString()
  resourceId?: string;

  @IsOptional()
  @IsObject({ message: 'Metadata must be valid object' })
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
