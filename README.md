## Description

This is an IAM platform with multi-tenant support.

Users sign-up, create an organization, invite teammates, assign roles, manage permissions, and track sensitive actions through audit logs.

Auth pattern - Session-bound JWT:
    
    - JWT for stateless token transport
    - Session state in Redis for revocation, rotation and control.

## Technology stack

- Framework: NestJS
- Database: PostgreSQL
- ORM: Prisma
- Cache & sessions: Redis
- Authentication: Passport.js
- JWT: @nestjs/jwt
- Validaton: class-validator
- Email: Nodemailer
- Background jobs: BullMQ
- Logging: local LoggingService
- API docs: Swagger

## Authentication

Flow :

Login -> Access Token (15min) -> Refresh Token (30 days) -> Redis Session -> Postgres Session record



## Authorization

Nest js guards:

JwtAuthGuard -> OrganizationGuard -> RolesGuard -> PermissionsbGuard
