import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SessionsService {
    constructor(private readonly dbService: DatabaseService,) { }
    createSession(userId: string) {

    }
}
