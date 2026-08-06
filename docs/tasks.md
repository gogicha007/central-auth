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
[ხ] REFRESH_TOKEN
[x] SESSION_REVOKED
[x] PASSWORD_CHANGED
[x] PASSWORD_RESET_REQUESTED
[x] PASSWORD_RESET_COMPLETED
[x] EMAIL_VERIFIED

    // User

[x] USER_CREATED
[ ] USER_UPDATED
[ ] USER_DEACTIVATED
[ ] USER_REACTIVATED
[ ] USER_DELETED

    // Organization

[x] ORGANIZATION_CREATED
[x] ORGANIZATION_UPDATED
[x] ORGANIZATION_DELETED
[ ] ORGANIZATION_TRANSFERRED

    // Membership

[x] MEMBER_INVITED
[x] MEMBER_JOINED
[ ] MEMBER_REMOVED

    // Roles

[ ] ROLE_CREATED
[ ] ROLE_UPDATED
[ ] ROLE_DELETED
[x] ROLE_ASSIGNED
[ ] ROLE_REMOVED

    // Permissions

[ ] PERMISSION_GRANTED
[ ] PERMISSION_REVOKED

    // Security

[ ] MFA_ENABLED
[ ] MFA_DISABLED
[ ] ACCOUNT_LOCKED
[ ] ACCOUNT_UNLOCKED
