export class CreateSessionDto {
  userId!: string;
  ip?: string;
  userAgent?: string;
  lastActivity!: Date;
  expiresAt!: Date;
}
