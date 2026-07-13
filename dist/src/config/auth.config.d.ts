declare const _default: (() => {
    jwtSecret: string | undefined;
    jwtTtl: string;
    refreshSecret: string | undefined;
    refreshTtl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    jwtSecret: string | undefined;
    jwtTtl: string;
    refreshSecret: string | undefined;
    refreshTtl: string;
}>;
export default _default;
