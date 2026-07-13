import { IsEmail, IsString, MinLength } from "class-validator";
import { UserStatus } from "@prisma/client";

export class SignUpDto {
    @IsEmail({}, { message: 'invalid email' })
    email!: string

    @MinLength(8, { message: 'min length of password 8 charachters' })
    password!: string

    @IsString({ message: 'first name must be string' })
    firstName!: string

    @IsString({ message: 'first name must be string' })
    lastName!: string
}

export class SignUpResonseDto {
    email!: string

    firstName!: string
    lastName!: string

    status?: UserStatus
}