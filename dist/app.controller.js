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
const user_controller_1 = __importDefault(require("./modules/user/user.controller"));
const post_controller_1 = __importDefault(require("./modules/post/post.controller"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const error_response_1 = require("./utils/response/error.response");
const connections_db_1 = __importDefault(require("./DB/connections.db"));
const socket_io_1 = require("socket.io");
const token_security_1 = require("./utils/security/token.security");
const connectedSocket = new Map();
const bootstrap = async () => {
    const port = process.env.PORT || 5000;
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    const limiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 60 * 60000,
        limit: 1000,
        message: { error: "Too many requests, please try again later." },
        statusCode: 429
    });
    app.use(limiter);
    // Define your routes here
    app.get('/', (req, res, next) => {
        return res.status(200).json({
            message: "Welcome to the Social App API"
        });
    });
    app.use("/auth", auth_controller_1.default);
    app.use("/user", user_controller_1.default);
    app.use("/post", post_controller_1.default);
    app.use('{/*dummy}', (req, res, next) => {
        return res.status(404).json({
            error: "Not Found",
            message: "The requested resource was not found on this server."
        });
    });
    app.use(error_response_1.globalErrorHandling);
    await (0, connections_db_1.default)();
    //hoooks
    // async function test() {
    // }
    const httpServer = app.listen(port, () => {
        console.log(`Server is running on port ${port} `);
    });
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
        }
    });
    io.use(async (socket, next) => {
        try {
            const { user, decoded } = await (0, token_security_1.decodeToken)({
                authorization: socket.handshake?.auth.authoriztion || "",
                tokenType: token_security_1.TokenEnum.access
            });
            connectedSocket.set(user._id.toString(), socket.id);
            // next(new BadReauest("fail in authentication middleware"))
        }
        catch (error) {
            next(error);
        }
    });
    io.on('connection', (socket) => {
        // console.log("A user connected");
        console.log({ connectedSocket });
        // connectedSocket.push(socket.id)
        socket.on("sayHi", (data) => {
            console.log("A user sent a message", { data });
            socket.
                // to(connectedSocket[connectedSocket.length]as string)
                emit("sayHi", "BE to FE");
        });
        console.log(socket.id);
        socket.on('disconnect', () => {
            // connectedSocket.delete()
            console.log("A user disconnected", socket.id);
        });
    });
};
exports.default = bootstrap;
//# sourceMappingURL=app.controller.js.map