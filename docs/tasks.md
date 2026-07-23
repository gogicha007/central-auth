## Database module

    [x] Database module

## Redis module

    [x] Redis module

## Logging service

## User module

## Auth module

    [x] Sign-up
        [x] hash the password
        [x] call to create user(usersService.create())
    [x] Login
    [ ] JwtStrategy
    [ ] JwtAuthGuard logic to rely on strategy + session validation
    [ ] Logout
        
    [ ] Refresh
        [x] refresh token
        [ ] refresh rotation
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
        [x] create user record
        [x] send email link
        [x] verify email
    [ ] update user

## Mail module

    [x] mail service
    [x] mail processor

## Session module
    [x] create session
    [x] revoke
    
## Redis module
    [ ] create Redis session
    [ ] Redis session reload in case of server reload
    
## Common

    [x] password module/service
    [x] logger middleware
    [x] exception filters
