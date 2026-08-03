import { UserStatus } from "@prisma/client";

export const blockedStatuses: UserStatus[] = [
    UserStatus.DEACTIVATED,
    UserStatus.DELETED,
    UserStatus.LOCKED,
    UserStatus.PENDING,
    UserStatus.SUSPENDED,
];
