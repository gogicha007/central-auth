export interface JwtPayload {
    sub: string;
    sid: string;
    org?: string;
    iat?: number;
    exp?: number;
}
