## Database module

    [x] Database module

## Redis module

    [x] Redis module
    [x] Redis service(get, set, delete)
    [x] Redis session reload in case of server reload(getActiveSEssions, SessionCacheWarmupService)

## Logging service

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

    [x] Logout endpoint
        [x] validate jwt & sessions(DB&redis)
        [x] revoke db session and delete redis record
        [ ] audit log for logout action

    [x] Refresh endpoint
        [x] verify token
        [x] check redis session
        [x] check Postgres revocation
        [x] rotate refresh token

    [ ] 
    [x] JwtStrategy (validate jwt signature + session)
    [x] JwtAuthGuard
    [ ] Logout

    [ ] Create organization
    [ ] Membership
    [ ] Invite
    [ ] Auth guard
    [ ] roles
        [ ] public(@Public decorator)
        [ ] superAdmin(@isSuperAdmin decorator)
        [ ] admin(@IsAdmin decorator)
        [ ] manager(@IsManager decorator)
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

## Common

    [x] password module/service
    [x] logger middleware
    [x] exception filters
