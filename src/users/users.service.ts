import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenType, UserStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto'
import { handlePrismaError } from '../common/filters/error.util';
import { ok } from '../common/utils/api-response.util';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly dbService: DatabaseService,
        private readonly mailService: MailService
    ) { }

    async create(payload: CreateUserDto) {
        let existingUser = await this.dbService.user.findUnique({
            where: { email: payload.email },
            select: { id: true }
        })

        if (existingUser) throw new ConflictException(`User with email: ${payload.email} already exists`)

        try {
            const { email, firstName, lastName, passwordHash } = payload
            const verificationToken = crypto.randomBytes(32).toString('hex')

            const createdUser = await this.dbService.$transaction(async (tx) => {
                // create user
                const newUser = await tx.user.create({
                    data: {
                        email,
                        passwordHash,
                        firstName,
                        lastName,
                        status: UserStatus.PENDING,
                        emailVerified: false
                    },
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        status: true,
                        emailVerified: true,
                    }
                })
                // send verification email
                const tokenHash = crypto
                    .createHash("sha256")
                    .update(verificationToken)
                    .digest("hex")

                const userToken = {
                    userId: newUser.id,
                    type: TokenType.EMAIL_VERIFICATION,
                    tokenHash,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }

                await tx.userToken.create({
                    data: {
                        userId: userToken.userId,
                        type: userToken.type,
                        tokenHash: userToken.tokenHash,
                        expiresAt: userToken.expiresAt
                    }
                })
                return newUser
            })

            await this.mailService.sendVerificationEmail(email, verificationToken)

            return ok('User created. Please check your email to verify your account', createdUser)
        } catch (error) {
            handlePrismaError(error)
        }
    }

    async verifyEmailByToken(receivedToken: string) {

        if (!receivedToken) throw new BadRequestException('Token not found')

        const now = new Date()

        const tokenHash = crypto.createHash('sha256')
            .update(receivedToken)
            .digest('hex')

        try {
            await this.dbService.$transaction(async (tx) => {
                const userToken = await tx.userToken.findUnique({
                    where: {
                        tokenHash,
                        type: TokenType.EMAIL_VERIFICATION
                    },
                    select: {
                        userId: true,
                        expiresAt: true,
                        usedAt: true
                    }
                })

                if (!userToken) throw new BadRequestException('Token not found')

                const updateCount = await tx.userToken.updateMany({
                    where: {
                        tokenHash,
                        usedAt: null,
                        expiresAt: { gte: now },
                        type: TokenType.EMAIL_VERIFICATION
                    },
                    data: {
                        usedAt: new Date()
                    }
                })

                if (updateCount.count === 0) throw new BadRequestException('Invalid or used token')

                await tx.user.update({
                    where: { id: userToken.userId },
                    data: {
                        status: UserStatus.ACTIVE,
                        emailVerified: true,
                        emailVerifiedAt: new Date()
                    }
                })

            })
            return ok('Email verified successfully. You can now log in.')
        } catch (error) {
            handlePrismaError(error)
        }
    }

    async checkUserCredentials(payload: LoginDto){
        console.log('check user credentials ', payload)
    }
}
