"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {  BadReauest } from '../../utils/response/error.response';
const User_model_1 = require("../../DB/model/User.model");
const error_response_1 = require("../../utils/response/error.response");
const user_reository_1 = require("../../DB/repository/user.reository");
class AuthenticationService {
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    constructor() { }
    /**
     *
     *  @param req Exress.Request
     *  @param res Express.Response
     *  @return Promise<Express.Response>
     *  @example()
     * return {messae: "Done",status:201,data:{}}
     */
    signup = async (req, res) => {
        let { firstName, lastName, email, password } = req.body;
        console.log({ firstName, lastName, email, password });
        const checkUserExist = await this.userModel.findOne({
            filter: { email },
            select: "email"
        });
        if (checkUserExist) {
            throw new error_response_1.ConflictException("email already exists");
        }
        const user = await this.userModel.creaeUser({
            data: [{ firstName, lastName, email, password }]
        });
        if (!user) {
            throw new error_response_1.BadReauest("fail");
        }
        // throw new BadReauest("Fail in auth",400);
        return res.status(201).json({
            message: "User created successfully",
            data: { user }
        });
    };
    login = (req, res) => {
        return res.status(200).json({
            message: "Done",
            data: req.body
        });
    };
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map