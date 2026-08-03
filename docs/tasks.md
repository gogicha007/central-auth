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

    [ ] password/forgot
        [x] create and store reset token
        [x] send password reset email
        [ ] accept users click on the link

    [ ] password/reset

    [ ] password/change(authenticated)

    AuthGuards
    [x] local strategy (validate email&password)
    [x] JwtStrategy (validate jwt signature + session)
    [x] JwtAuthGuard

## Organizatoins module

    [x] create organization
        [x] create organization
        [x] create role(OWNER)
        [x] create organization member

    [x] update organizatoin
    [x] delete organization

    [ ] Membership

    [ ] Invite member
        [ ] create invitation
        [ ] send invitation email to user

    [ ] roles
        [ ] create role

## Common

    [x] logging service
    [x] middleware(logging service)
    [x] exception filters

## User module

    [x] create user
    [ ] update user


## Mail module

    [x] mail service
    [x] mail processor

## Session module

    [x] create session
    [x] revoke
    [x] session-cleanup for revoked sessions (30 days(.env) retention)

## Common

    [x] password module/service
    [x] logger middleware
    [x] exception filters
