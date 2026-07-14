import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '../mail/mail.service';
export declare class UsersService {
    private readonly dbService;
    private readonly mailService;
    constructor(dbService: DatabaseService, mailService: MailService);
    create(payload: CreateUserDto): Promise<{
        messate: string;
    }>;
    verifyEmail(id: string): Promise<{
        message: string;
    }>;
}
