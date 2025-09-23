"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const comment_validation_1 = require("./comment.validation");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const authentication_middlewar_1 = require("../../middleware/authentication.middlewar");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", (0, validation_middleware_1.validation)(comment_validation_1.createComment), comment_service_1.default.createComment);
router.post("/:commentId/reply", (0, validation_middleware_1.validation)(comment_validation_1.replyComment), comment_service_1.default.replyComment);
router.patch("/:commentId", (0, authentication_middlewar_1.authentication)(), comment_service_1.default.updateComment);
router.patch("/:commentId/freeze", (0, authentication_middlewar_1.authentication)(), comment_service_1.default.freezeComment);
router.delete("/:commentId/hard", (0, authentication_middlewar_1.authentication)(), comment_service_1.default.hardDeleteComment);
router.get("/:commentId", (0, authentication_middlewar_1.authentication)(), comment_service_1.default.getCommentById);
router.get("/:commentId/with-replies", (0, authentication_middlewar_1.authentication)(), comment_service_1.default.getCommentWithReply);
exports.default = router;
//# sourceMappingURL=comment.controller.js.map