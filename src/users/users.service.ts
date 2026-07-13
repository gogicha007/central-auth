import { Injectable, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly dbService: DatabaseService) { }

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

        if (!user) {
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
        }
    }


}
