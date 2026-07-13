"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
let LoggingService = class LoggingService {
    logLevel;
    logFilePath;
    maxFileSizeKB;
    constructor() {
        this.logLevel = 'info';
        this.logFilePath = path.resolve('logs', 'application.log');
        this.maxFileSizeKB = parseInt(process.env.LOG_FILE_MAX_SIZE_KB || '1024', 10);
        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }
    }
    shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug'];
        return levels.indexOf(level) <= levels.indexOf(this.logLevel);
    }
    rotateLogFile() {
        const stats = fs.statSync(this.logFilePath);
        if (stats.size / 1024 > this.maxFileSizeKB) {
            const rotatedFile = `${this.logFilePath}.${Date.now()}`;
            fs.renameSync(this.logFilePath, rotatedFile);
        }
    }
    writeLog(level, message) {
        const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()} ${message}\n]`;
        fs.appendFileSync(this.logFilePath, logMessage);
        this.rotateLogFile();
    }
    log(level, message) {
        if (this.shouldLog(level)) {
            this.writeLog(level, message);
        }
    }
    error(message, trace) {
        this.log('error', `${message}${trace ? `\nTrace: ${trace}` : ''}`);
    }
    warn(message) {
        this.log('warn', message);
    }
    info(message) {
        this.log('info', message);
    }
    debug(message) {
        this.log('debug', message);
    }
};
exports.LoggingService = LoggingService;
exports.LoggingService = LoggingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggingService);
//# sourceMappingURL=logging.service.js.map