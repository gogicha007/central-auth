import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
    private readonly configService: ConfigService,
  ) { }

  async sendVerificationEmail(email: string, token: string) {
    const baseUrl = this.configService.get<string>('APP_URL');
    const verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;

    await this.mailQueue.add(
      'send-verification-email',
      {
        to: email,
        link: verificationLink,
      },
      {
        attempts: 3,
        backoff: 5000,
      },
    );
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = this.configService.get<string>('FRONT_URL');
    const passwordResetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    await this.mailQueue.add(
      'send-password-reset',
      {
        to: email,
        link: passwordResetLink,
      },
      {
        attempts: 3,
        backoff: 5000,
      },
    );
  }

  async sendInvitationEmail(email: string, token: string) {
    const baseUrl = this.configService.get<string>('APP_URL')
    const invitationLink = `${baseUrl}/auth/invitation?token=${token}`;

    await this.mailQueue.add(
      'send-invitation',
      {
        to: email,
        link: invitationLink
      },
      {
        attempts: 3,
        backoff: 5000
      }
    )
  }

  async sendEmailChangeEmail(email: string, token: string) {
    const baseUrl = this.configService.get<string>('APP_URL')
    const emailChangeLink = `${baseUrl}/auth/email-change?token=${token}`;

    await this.mailQueue.add(
      'send-email-change',
      {
        to: email,
        link: emailChangeLink
      },
      {
        attempts: 3,
        backoff: 5000
      }
    )
  }
}
