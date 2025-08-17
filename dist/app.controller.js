"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: (0, node_path_1.resolve)("./config/.env.development") });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const bootstrap = async () => {
    const port = process.env.PORT || 5000;
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(cors_1.default);
    // Define your routes here
    app.get('/', (req, res, next) => {
        return res.status(200).json({
            message: "Welcome to the Social App API"
        });
    });
    app.use("/auth", auth_controller_1.default);
    app.listen(port, () => {
        console.log(`Server is running on port ${port} `);
    });
};
exports.default = bootstrap;
//# sourceMappingURL=app.controller.js.map