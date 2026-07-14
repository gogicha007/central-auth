import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
export declare class MailProcessor extends WorkerHost {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    process(job: Job<{
        to: string;
        link: string;
    }>): Promise<any>;
}
