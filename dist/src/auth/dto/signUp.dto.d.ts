import { UserStatus } from "@prisma/client";
export declare class SignUpDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export declare class SignUpResonseDto {
    email: string;
    firstName: string;
    lastName: string;
    status?: UserStatus;
}
