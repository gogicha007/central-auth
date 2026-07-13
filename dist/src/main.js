"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const logging_service_1 = require("../libs/services/logging.service");
async function bootstrap() {
    const logger = new common_1.Logger('CentralAuth');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const loggingService = app.get(logging_service_1.LoggingService);
    app.enableShutdownHooks();
    const PORT = Number(process.env.PORT ?? 3000);
    process.on('uncaughtException', (error) => {
        loggingService.error('Uncaught Exception', error.stack);
    });
    process.on('undahdledRejection', (reason) => {
        loggingService.error('Unhandled Rejection', JSON.stringify(reason));
    });
    await app.listen(PORT);
    logger.log(`CentralAuth running at port ${PORT}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map