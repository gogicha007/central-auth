import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class MailProcessor extends WorkerHost {
    private readonly logger;
    private transporter;
    constructor();
    process(job: Job<{
        to: string;
        link: string;
    }>): Promise<any>;
}
