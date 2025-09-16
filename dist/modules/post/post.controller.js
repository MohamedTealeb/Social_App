"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middlewar_1 = require("../../middleware/authentication.middlewar");
const post_service_1 = __importDefault(require("./post.service"));
const router = (0, express_1.Router)();
router.post("/", (0, authentication_middlewar_1.authentication)(), post_service_1.default.createPost);
exports.default = router;
//# sourceMappingURL=post.controller.js.map