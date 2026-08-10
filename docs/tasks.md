## Database module

    [x] Database module

## Redis module

    [x] Redis module
    [x] Redis service(get, set, delete)
    [x] Redis session reload in case of server reload(getActiveSEssions, SessionCacheWarmupService)

## Auth module

    [x] Sign-up endpoint
        [x] hash the password
        [x] create user record
        [x] send email link
        [x] verify email

    [x] Login endpoint
        [x] validate credentials(email&password)
        [x] create Postgres session row
        [x] Create Redis session entry keyed by session id
        [x] Issue access token
        [x] Issue refresh token
        [ ] audit log

    [x] Logout endpoint
        [x] validate jwt & sessions(DB&redis)
        [x] revoke db session and delete redis record
        [ ] audit log for logout action

    [x] Refresh endpoint
        [x] validate jwt & sessions
        [x] verify token
        [x] check redis session
        [x] check Postgres revocation
        [x] rotate refresh token

    [x] sessions endpoint
        [x] validate jwt & session
        [x] get active sessions by user id

    [x] sessions/:id/revoke endpoint
        [x] validate jwt & session
        [x] revoke session (redis&DB) by sessionId

    [x] password/forgot(reset)
        [x] create and store reset token
        [x] send password reset email
        [x] request from the frontent to verify token
        [x] request from the forntend to reset the password

    [x] password/change(authenticated)

    AuthGuards
    [x] local strategy (validate email&password)
    [x] JwtStrategy (validate jwt signature + session)
    [x] JwtAuthGuard

## Invitations module

    [x] create invitation

## Organizatoins module

    [x] create organization
        [x] create organization
        [x] create role(OWNER)
        [x] create organization member

    [x] update organizatoin
    [x] delete organization

    [x] Membership
        [x] Invite member
            [x] send invitation email to user
                - request: organizations/:id/invitations, body {roleName, email}
                - check if role exists in roles table
                - send email link with query: organizationId, roleId, userId
            [x] invitation accept
                - create member record
        [x] update membership role

## Roles module

    [x] roles
        [x] create role
        [x] update role (description& isSystem fields only)

## Common

    [x] logging service
    [x] middleware(logging service)
    [x] exception filters

## User module

    [x] create user
    [ ] update user
    [ ] get all users

## Mail module

    [x] mail service
        [x] send verification email link
        [x] send password reset email link
    [x] mail processor
        [x] verify email
        [x] reset password

## Session module

    [x] create session
    [x] revoke
    [x] session-cleanup for revoked sessions (30 days(.env) retention)

## Common

    [x] password module/service
    [x] logger middleware
    [x] exception filters

## Audit module

Audit Actions

    [x] LOGIN
    [x] LOGIN_FAILED
    [x] LOGOUT
    [x] REFRESH_TOKEN
    [x] SESSION_REVOKED
    [x] PASSWORD_CHANGED
    [x] PASSWORD_RESET_REQUESTED
    [x] PASSWORD_RESET_COMPLETED
    [x] EMAIL_VERIFIED


    [x] USER_CREATED
    [ ] USER_UPDATED
    [ ] USER_DEACTIVATED
    [ ] USER_REACTIVATED
    [ ] USER_DELETED


    [x] ORGANIZATION_CREATED
    [x] ORGANIZATION_UPDATED
    [x] ORGANIZATION_DELETED
    [x] ORGANIZATION_TRANSFERRED


    [x] MEMBER_INVITED
    [x] MEMBER_JOINED
    [x] MEMBER_REMOVED


    [ ] ROLE_CREATED
    [ ] ROLE_UPDATED
    [ ] ROLE_DELETED
    [x] ROLE_ASSIGNED


    [ ] PERMISSION_GRANTED
    [ ] PERMISSION_REVOKED


    [ ] MFA_ENABLED
    [ ] MFA_DISABLED
    [ ] ACCOUNT_LOCKED
    [ ] ACCOUNT_UNLOCKED


## Authorization matrix

[x] Create organization:
    [x] authenticated user
    [x] platform admin

[x] View own organization:
    [x] any active member of that organization
    [x] platform admin

[x] Update organization profile:
    [x] OWNER, ADMIN
    [x] platform admin

[x] Invite member:
    [x] OWNER, ADMIN, DIRECTOR
    [x] platform admin

[x] Change(update) member role:
    [x] OWNER, ADMIN only for lower roles
    [x] - platform admin

[x] Remove member:
    [x] OWNER, ADMIN for non-owner members
    [x] platform admin

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