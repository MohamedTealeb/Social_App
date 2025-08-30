"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {  BadReauest } from '../../utils/response/error.response';
const User_model_1 = require("../../DB/model/User.model");
const error_response_1 = require("../../utils/response/error.response");
const user_reository_1 = require("../../DB/repository/user.reository");
const hash_security_1 = require("../../utils/security/hash.security");
const email_event_1 = require("../../utils/event/email.event");
const otp_1 = require("../../utils/otp");
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
        const otp = (0, otp_1.generateNumberOtp)();
        const user = await this.userModel.creaeUser({
            data: [{ firstName, lastName, email, password: await (0, hash_security_1.generateHash)(password), confrimEmailOtp: await (0, hash_security_1.generateHash)(String(otp)) }]
        });
        if (!user) {
            throw new error_response_1.BadReauest("fail");
        }
        email_event_1.emailEvent.emit("confirmEmail", {
            to: email,
            otp
        });
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
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, confrimEmailOtp: { $exists: true }, confirmAt: { $exists: false } },
        });
        if (!user) {
            throw new error_response_1.Notfound("Invalid account");
        }
        if (!await (0, hash_security_1.CompareHash)(otp, user.confrimEmailOtp)) {
            throw new error_response_1.ConflictException("Invalid confirmation code");
        }
        await this.userModel.updateOne({
            filter: { email },
            update: {
                confirmAt: new Date(),
                $unset: {
                    confrimEmailOtp: true
                }
            },
        });
        return res.status(200).json({
            message: "Done",
            data: req.body
        });
    };
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map