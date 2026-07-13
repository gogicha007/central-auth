import { Injectable, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto'

@Injectable()
export class UsersService {
    constructor(
        private readonly dbService: DatabaseService,
        private readonly mailService: MailService
    ) { }

    async create(payload: CreateUserDto) {
        let user = await this.dbService.user.findUnique({
            where: { email: payload.email },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                status: true,
                emailVerified: true,
                id: true
            }
        })

        if (user) throw new ConflictException(`User with email: ${payload.email} already exists`)

        const { email, firstName, lastName, passwordHash } = payload

        const verificationToken = crypto.randomBytes(32).toString('hex')

        user = await this.dbService.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                status: UserStatus.PENDING,
                emailVerified: false
            },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                status: true,
                emailVerified: true,
                id: true
            }
        })

        await this.mailService.sendVerificationEmail(email, verificationToken)

        return { messate: 'User created. Please check your email to verify your account' }
    }

    async verifyEmail(id: string){
        await this.dbService.user.update({
            where: {id },
            data: {
                status: UserStatus.ACTIVE,
                emailVerified: true
            }
        })

        return { message: 'Email verified successfully. You can now log in.'}
    }
}
