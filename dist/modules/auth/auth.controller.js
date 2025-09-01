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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_service_1 = __importDefault(require("./auth.service"));
const validators = __importStar(require("./auth.validation"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/signup", (0, validation_middleware_1.validation)(validators.signup), auth_service_1.default.signup);
router.post("/signup-gmail", (0, validation_middleware_1.validation)(validators.signupWithGmail), auth_service_1.default.signupWithGmail);
router.post("/login-gmail", (0, validation_middleware_1.validation)(validators.signupWithGmail), auth_service_1.default.LoginWithGmail);
router.post("/login", (0, validation_middleware_1.validation)(validators.login), auth_service_1.default.login);
router.patch("/send-reset-password", (0, validation_middleware_1.validation)(validators.sendForgotPasseordCode), auth_service_1.default.sendForgotCode);
router.patch("/verify-reset-password", (0, validation_middleware_1.validation)(validators.verifyForgotPasseordCode), auth_service_1.default.verifyForgotPasseordCode);
router.patch("/reset-password", (0, validation_middleware_1.validation)(validators.restForgotPasseordCode), auth_service_1.default.resetForgotPasseordCode);
router.patch("/confirm-email", (0, validation_middleware_1.validation)(validators.confirmEmail), auth_service_1.default.confirmEmail);
exports.default = router;
//# sourceMappingURL=auth.controller.js.map