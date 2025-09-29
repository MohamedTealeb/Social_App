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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middlewar_1 = require("../../middleware/authentication.middlewar");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const Validators = __importStar(require("./chat.validation"));
const chat_service_1 = require("./chat.service");
const router = (0, express_1.Router)({ mergeParams: true });
const chatService = new chat_service_1.ChatService();
router.get("/", (0, authentication_middlewar_1.authentication)(), (0, validation_middleware_1.validation)(Validators.getChat), chatService.getChat);
router.get("/group/:groupId", (0, authentication_middlewar_1.authentication)(), (0, validation_middleware_1.validation)(Validators.getChatgroup), chatService.getChatgroup);
router.post("/group", (0, authentication_middlewar_1.authentication)(), (0, validation_middleware_1.validation)(Validators.createGroup), chatService.createGroup);
exports.default = router;
//# sourceMappingURL=chat.controller.js.map