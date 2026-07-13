import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import *  as nodemailer from 'nodemailer'


@Processor('mail-queue')
@Injectable()
export class MailProcessor extends WorkerHost {
    private readonly logger = new Logger(MailProcessor.name)
    private transporter: nodemailer.Transporter

    constructor() {
        super()
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_host,
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
    }

    async process(job: Job<{ to: string; link: string }>): Promise<any> {
        if (job.name === 'send-verification') {
            const { to, link } = job.data

            this.logger.log(`Processing verification email to ${to}`)

            try {
                await this.transporter.sendMail({
                    from: `"Central Auth" <no-reply@centralapp.com`,
                    to,
                    subject: 'Verify Your email Address',
                    html: `<p>Welcome! Please verify your email by clicking <a href="${link}">here</a>.</p>`,
                })

                this.logger.log(`Email successfully sent to ${to}`)
            } catch (error: any) {
                this.logger.error(`Failed to send email to ${to}`, error.stack)
                throw error
            }
        }
    }
}