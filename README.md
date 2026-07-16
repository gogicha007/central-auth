## Description

This is an IAM platform with multi-tenant support.

Users sign-up, create an organization, invite users, assign roles, manage permissions, and track sensitive actions through audit logs.

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

Sign-up:

    1. User enters email, password, first&last names
    2. System creates User with status=PENDING and emailVeriried=false
    3. System sends verification link to user's email
        - creates UserToken record for email_verification.
        - adds task to BullMq queue, with job.name: "send-verification-email"
        - MailProcessor(declared as a background worker) detects the task with specific job.name in queue and runs the code that sends an email
    4. User clicks the link, account becomes ACTIVE and emailVerified = true
        - User clicks the link -> auth.controller/@Get('verify-email') catches

Login:
    1. Check credentials
    3. Update failedLoginCount field 
        - in case of wrong password: +1
        - in case of right password: 0
    2. Issue access token
    3. 
 -> Access Token (15min) -> Refresh Token (30 days) -> Redis Session -> Postgres Session record

## Authorization

Nest js guards:

JwtAuthGuard -> OrganizationGuard -> RolesGuard -> PermissionsbGuard

## Resopnse

in case of success:
{
success: boolean,
message: string
data: string | null
}

in case of error:
{
statusCode: number,
message: string
}
