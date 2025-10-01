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
const chat_controller_1 = __importDefault(require("./modules/chat/chat.controller"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const error_response_1 = require("./utils/response/error.response");
const connections_db_1 = __importDefault(require("./DB/connections.db"));
const getway_1 = require("./modules/getway/getway");
const graphql_1 = require("graphql");
const express_2 = require("graphql-http/lib/use/express");
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
    const schema = new graphql_1.GraphQLSchema({
        query: new graphql_1.GraphQLObjectType({
            name: "mainQueryName",
            fields: {
                sayHi: {
                    type: graphql_1.GraphQLString,
                    resolve: () => {
                        return "Hello GraphQl";
                    },
                },
            },
        }),
    });
    app.all("/graphql", (0, express_2.createHandler)({ schema }));
    // Define your routes here
    app.get('/', (req, res, next) => {
        return res.status(200).json({
            message: "Welcome to the Social App API"
        });
    });
    app.use("/auth", auth_controller_1.default);
    app.use("/user", user_controller_1.default);
    app.use("/post", post_controller_1.default);
    app.use("/chat", chat_controller_1.default);
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
    (0, getway_1.initializeIo)(httpServer);
};
exports.default = bootstrap;
//# sourceMappingURL=app.controller.js.map