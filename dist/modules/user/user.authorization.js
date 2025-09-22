"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoint = void 0;
const User_model_1 = require("../../DB/model/User.model");
exports.endpoint = {
    profile: [User_model_1.RoleEnum.user],
    dashboard: [User_model_1.RoleEnum.admin, User_model_1.RoleEnum.superAdmin]
};
//# sourceMappingURL=user.authorization.js.map