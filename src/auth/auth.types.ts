export interface JwtPayload {
    sub: string; // user id
    sid: string; // session id
    org?: string; // organization
    iat?: number; // issued at
    exp?: number; // expiration
}