"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = require("../../DB/model/User.model");
const user_reository_1 = require("../../DB/repository/user.reository");
const token_repository_1 = require("../../DB/repository/token.repository");
const Token_model_1 = require("../../DB/model/Token.model");
const token_security_1 = require("../../utils/security/token.security");
class UserService {
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    tokenModel = new token_repository_1.TokenRepository(Token_model_1.TokenModel);
    constructor() { }
    profile = async (req, res) => {
        return res.json({
            message: "Done",
            date: {
                user: req.user,
                decoded: req.decoded
            }
        });
    };
    logout = async (req, res) => {
        const { flag } = req.body;
        let statusCode = 200;
        const update = {};
        switch (flag) {
            case token_security_1.LogoutEnum.all:
                update.changeCredentialTime = new Date();
                break;
            default:
                await (0, token_security_1.createRevokeToken)(req.decoded);
                statusCode = 201;
                break;
        }
        await this.userModel.updateOne({
            filter: { _id: req.decoded?._id },
            update
        });
        return res.status(statusCode).json({
            message: "Done",
            date: {
                user: req.user,
                decoded: req.decoded
            }
        });
    };
    refreshToken = async (req, res) => {
        const credentials = await (0, token_security_1.createLoginCredentaails)(req.user);
        await (0, token_security_1.createRevokeToken)(req.decoded);
        return res.status(201).json({
            message: "Donne",
            data: {
                credentials
            }
        });
    };
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map