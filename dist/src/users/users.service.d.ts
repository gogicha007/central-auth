import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    create(payload: CreateUserDto): Promise<string | undefined>;
}
