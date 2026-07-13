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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const logging_service_1 = require("../services/logging.service");
let LoggingInterceptor = class LoggingInterceptor {
    loggingService;
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const contentType = req.headers['content-type'];
        const isMultipart = typeof contentType === 'string' &&
            contentType.toLowerCase().startsWith('multipart/form-data');
        if (!isMultipart) {
            return next.handle();
        }
        const body = req.body;
        const file = req.file
            ? {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
            }
            : undefined;
        this.loggingService.info(`Request has multipart body: ${JSON.stringify(body)}, file: ${JSON.stringify(file)}, files: ${JSON.stringify(req.files)}`);
        return next.handle();
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map