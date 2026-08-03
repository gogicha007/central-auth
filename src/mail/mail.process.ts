import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Processor('mail-queue')
@Injectable()
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    super();
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT') || '587'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async process(job: Job<{ to: string; link: string }>): Promise<any> {
    if (job.name === 'send-verification-email') {
      const { to, link } = job.data;

      this.logger.log(`Processing verification email to ${to}`);

      try {
        await this.transporter.sendMail({
          from: `"Central Auth" <no-reply@centralapp.com`,
          to,
          subject: 'Verify Your email Address',
          html: `<p>Welcome! Please verify your email by clicking <a href="${link}">here</a>.</p>`,
        });

        this.logger.log(`Email successfully sent to ${to}`);
      } catch (error: unknown) {
        this.logger.error(
          `Failed to send email to ${to}`,
          error instanceof Error ? error.stack : String(error),
        );
        throw error;
      }
    }
  }
}
