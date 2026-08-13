## Description

This is an IAM platform with multi-tenant support.

As the user can be member of different organization inside the system, after sign-up is invited to organization.

The same role name can have different permissions for the different organization

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

# Auth module

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

    1. Validate user
        - check user in db
        - check its blocking statuses
        - check password
        - Update failedLoginCount field
            - in case of wrong password: increment by 1
            - in case of right password: 0
            - if failedLoginCount exceeds the limit (5) -> update user status as LOCKED
        - check lockedAt time and calculate if 30 minutes(env: ACCOUT_LOCK_DURATION_M) and act accordingly

    2. Create session
        - set session absolute expiration time (30 days)
        - set session idle expiration time (72 hours)
        - Postgres
            - check if active session of the user exists and update(revoke)
            - create new Session record
        - redis session&redis sessions reload

    3. Issue Access token & Refresh token
        - set access token secret&ttl and create
        - set refresh token secret&ttl and create

## Authorization

AuthGuards based on strategies using Passport library

- local strategy: check username and password
- jwt strategy:
  - check JWT signature + expiry (done by Passport)
  - Validate sessions:
    - load redis session
    - check active/revoked/idle expiry

Other guards:

- OrganizationGuard

- RolesGuard
  - first: roles guard checks if user isPlatformAdmin is true and gives unlimited access
  - second: if not (isPlatformAdmin false) compares to the role user has in specific organization

- PermissionsbGuard

## Password management

Password recovery flow

1. User requests password reset
   - POST /auth/password/forgot
   - Backend validates the email, creates a one-time reset token, stores its hash and emails a link

2. Email contains a short-lived link
   - sent to frontend app route: www.frontend-url.com/reset-password?token=...
   - the link includes only token(not password)

3. User clicks the link
   - frontend reads the token from the link and
   - frontend sends the token to backend for validation
     - POST /auth/password/reset/validate - body: {token}
     - backend checks if
       - token exists
       - token hash matches a stored recort
       - token is not expired
       - token belongs to an active user
   - backend returns a validation result
   - frontent reacts accordingly:
     - if valid: show the password form
     - if invalid: show an error and ask the user to request a new reset link
   - by submitting password form frontend sends request:
     - POST /auth/password/reset
     - body: {token, newPassword}
   - backend 
       - validates the token, updates as used (in user_token table)
       - updates user password
       - revokes all active sessions by user (DB&Redis)


Password change for authenticated user
  - POST password/change, body {currentPassword, newPassword}
  - verify currentPassword, check old and new passwords are not the same
  - revoke all active sessions by user (DB&Redis)

# Rate limiting

Multiple throttler definitions are set up in app.module
protected endpoints: - auth/password/forgot endpoint protected with ip&email rate limiting

# Resopnse

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

# Sessions module

- cleanup revoked sessions: removes records of revoked sessions after retention days
- get user active sessions: returns the list of active sessions by user

# Users

Authorization matrix

- Get all users:
  - platform admin only

- Get own profile:
  - authenticated user (self)
  - platform admin

- Update own profile (firstName, lastName):
  - authenticated user (self)
  - platform admin

- Update other user's profile:
  - platform admin only

- Deactivate own account:
  - authenticated user (self)

- Deactivate other user's account:
  - platform admin only

- Reactivate account:
  - platform admin only
  - user cannot self-reactivate since DEACTIVATED blocks login (blockedStatuses)

- Delete account (soft-delete, status=DELETED):
  - platform admin only
  - user data retained for audit purposes, never hard-deleted
  
# Organizations

Authorization matrix

- Create organization:
  - authenticated user
  - platform admin

- View own organization:
  - any active member of that organization
  - platform admin

- Update organization profile:
  - OWNER, ADMIN
  - platform admin

- Invite member:
  - OWNER, ADMIN, DIRECTOR
  - platform admin

- Accept invitation:
  - invited user with valid token
  - no org role required

- Change member role:
  - OWNER
  - ADMIN only for lower roles
  - platform admin

- Remove member:
  - OWNER
  - ADMIN for non-owner members
  - platform admin

- Delete organization:
  - OWNER
  - platform admin

- Transfer ownership:
  - OWNER
  - platform admin

Delegation rules

- OWNER
  - can assign ADMIN, MANAGER, DIRECTOR, EMPLOYEE, VIEWER
  - can transfer ownership
  - can delete org

- ADMIN
  - can assign MANAGER, DIRECTOR, EMPLOYEE, VIEWER
  - cannot assign OWNER
  - cannot remove current OWNER

- DIRECTOR
  - can invite MANAGER, EMPLOYEE and VIEWER
  - cannot assign ADMIN

- MANAGER, EMPLOYEE, VIEWER
  - no membership-management authority by default


Endpoints

- Create onganization - {POST} organizations/
  - NOTE: creator of organization becomes OWNER. transacion covers three tables: organization, role and organizationMember
    1. create organization (return organizationId)
    2. create role RoleNames.OWNER (with organizationId)
    3. create organizationMember (with organizationId, creatorUserId, roleID)

- find all - {GET} organizations/

- Invite members - POST roganizations/:id/invitations body {email, roleId, create}

- Update organization - {PATCH} organizationa/:orgId

- transferOwnership - {POST} organizations/:orgId/transfer

- update membership role

- remove member from the org


## Roles module
  - create role (through organizations controller)
  - update role (description & isSystem fields only)

RolePermissions
  - assign permission to the role
  - remove permission from the role


## Persmissions module
  - create permission
  - findAll permissions
  - findOne permission
  - update permission
  - remove permission