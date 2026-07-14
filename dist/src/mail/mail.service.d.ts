import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly mailQueue;
    private readonly configService;
    constructor(mailQueue: Queue, configService: ConfigService);
    sendVerificationEmail(email: string, token: string): Promise<void>;
}
