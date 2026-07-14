"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const config_1 = require("@nestjs/config");
let MailService = class MailService {
    mailQueue;
    configService;
    constructor(mailQueue, configService) {
        this.mailQueue = mailQueue;
        this.configService = configService;
    }
    async sendVerificationEmail(email, token) {
        const baseUrl = this.configService.get('APP_URL');
        const verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;
        await this.mailQueue.add('send-verification-email', {
            to: email,
            link: verificationLink
        }, {
            attempts: 3,
            backoff: 5000
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('mail-queue')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map