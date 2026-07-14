import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenType, UserStatus } from '@prisma/client';
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

        // create user
        const { email, firstName, lastName, passwordHash } = payload

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

        // send verification email
        const verificationToken = crypto.randomBytes(32).toString('hex')

        const tokenHash = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex")

        const userToken = {
            userId: user.id,
            type: TokenType.EMAIL_VERIFICATION,
            tokenHash,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }

        await this.dbService.userToken.create({
            data: {
                userId: userToken.userId,
                type: userToken.type,
                tokenHash: userToken.tokenHash,
                expiresAt: userToken.expiresAt
            }
        })

        await this.mailService.sendVerificationEmail(email, verificationToken)

        return { message: 'User created. Please check your email to verify your account' }
    }

    async verifyEmailByToken(receivedToken: string) {
        const receivedTokenHash = crypto.createHash('sha256')
            .update(receivedToken)
            .digest('hex')

        const userToken = await this.dbService.userToken.findUnique({
            where: {
                tokenHash: receivedTokenHash,
                type: TokenType.EMAIL_VERIFICATION
            },
            select: {
                userId: true,
                expiresAt: true,
                usedAt: true
            }
        })

        if (!userToken) throw new BadRequestException('Token not found')

        if (userToken.expiresAt < new Date()) throw new BadRequestException('Token expired')

        if (userToken.usedAt) throw new BadRequestException('Token already used')

        try {
            await this.dbService.$transaction(async (tx) => {
                await tx.user.update({
                    where: { id: userToken.userId },
                    data: {
                        status: UserStatus.ACTIVE,
                        emailVerified: true,
                        emailVerifiedAt: new Date()
                    }
                })

                await tx.userToken.update({
                    where: { tokenHash: receivedTokenHash },
                    data: {
                        usedAt: new Date(Date.now())
                    }
                })
            })
        } catch (error) {
            throw new Error()
        }

        return { message: 'Email verified successfully. You can now log in.' }
    }
}
