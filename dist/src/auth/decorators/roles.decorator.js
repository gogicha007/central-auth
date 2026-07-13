"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsManager = exports.isSuperAdmin = exports.REQUIRED_ROLE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRED_ROLE_KEY = 'requiredRole';
const isSuperAdmin = () => (0, common_1.SetMetadata)(exports.REQUIRED_ROLE_KEY, 'SuperAdmin');
exports.isSuperAdmin = isSuperAdmin;
const IsManager = () => (0, common_1.SetMetadata)(exports.REQUIRED_ROLE_KEY, 'manager');
exports.IsManager = IsManager;
//# sourceMappingURL=roles.decorator.js.map