"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middlewar_1 = require("../../middleware/authentication.middlewar");
const post_service_1 = __importDefault(require("./post.service"));
const comment_controller_1 = __importDefault(require("../comment/comment.controller"));
const router = (0, express_1.Router)();
router.use("/:postId/comment", (0, authentication_middlewar_1.authentication)(), comment_controller_1.default);
router.get("/", (0, authentication_middlewar_1.authentication)(), post_service_1.default.postList);
router.post("/add", (0, authentication_middlewar_1.authentication)(), post_service_1.default.createPost);
router.patch("/like/:postId", (0, authentication_middlewar_1.authentication)(), post_service_1.default.likePost);
router.patch("/:postId", (0, authentication_middlewar_1.authentication)(), post_service_1.default.updatePost);
exports.default = router;
//# sourceMappingURL=post.controller.js.map