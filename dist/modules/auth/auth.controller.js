"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/signup", auth_service_1.default.signup);
router.post("/login", auth_service_1.default.login);
exports.default = router;
//# sourceMappingURL=auth.controller.js.map