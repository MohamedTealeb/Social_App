"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {  BadReauest } from '../../utils/response/error.response';
const User_model_1 = require("../../DB/model/User.model");
const error_response_1 = require("../../utils/response/error.response");
const user_reository_1 = require("../../DB/repository/user.reository");
const hash_security_1 = require("../../utils/security/hash.security");
const email_event_1 = require("../../utils/event/email.event");
const otp_1 = require("../../utils/otp");
const token_security_1 = require("../../utils/security/token.security");
const google_auth_library_1 = require("google-auth-library");
class AuthenticationService {
    userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    constructor() { }
    async verifyGmailAccount(idToken) {
        const client = new google_auth_library_1.OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_IDS?.split(",") || []
        });
        const payload = ticket.getPayload();
        if (!payload?.email_verified) {
            throw new error_response_1.BadReauest("fail to verify google acc");
        }
        return payload;
    }
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
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, provider: User_model_1.providerEnm.SYSTEM }
        });
        if (!user) {
            throw new error_response_1.Notfound("invalid login data");
        }
        if (!user.confirmAt) {
            throw new error_response_1.BadReauest("verify your acc first");
        }
        if (!(await (0, hash_security_1.CompareHash)(password, user.password))) {
            throw new error_response_1.Notfound("invalid login data");
        }
        const credentials = await (0, token_security_1.createLoginCredentaails)(user);
        return res.status(200).json({
            message: "Done",
            data: { credentials }
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
    signupWithGmail = async (req, res) => {
        const { idToken } = req.body;
        const { email, family_name, given_name, picture } = await this.verifyGmailAccount(idToken);
        const user = await this.userModel.findOne({
            filter: {
                email,
            }
        });
        if (user) {
            if (user.provider === User_model_1.providerEnm.GOOGLE) {
                return await this.LoginWithGmail(req, res);
            }
            throw new error_response_1.ConflictException(`Email exist with another provider ${user.provider}`);
        }
        const [newUser] = await this.userModel.create({
            data: [{ firstName: given_name,
                    lastName: family_name,
                    email: email,
                    profileImage: picture,
                    confirmAt: new Date(),
                    provider: User_model_1.providerEnm.GOOGLE }]
        }) || [];
        if (!newUser) {
            throw new error_response_1.BadReauest("Fail to signup with gmail please try again later");
        }
        const credentials = await (0, token_security_1.createLoginCredentaails)(newUser);
        return res.status(201).json({
            message: "Done",
            data: {
                credentials
            }
        });
    };
    LoginWithGmail = async (req, res) => {
        const { idToken } = req.body;
        const { email } = await this.verifyGmailAccount(idToken);
        const user = await this.userModel.findOne({
            filter: {
                email,
                provider: User_model_1.providerEnm.GOOGLE
            }
        });
        if (!user) {
            throw new error_response_1.Notfound(`not register account or registerd with another provider`);
        }
        const credentials = await (0, token_security_1.createLoginCredentaails)(user);
        return res.status(200).json({
            message: "Done",
            data: {
                credentials
            }
        });
    };
    sendForgotCode = async (req, res) => {
        const { email } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, provider: User_model_1.providerEnm.SYSTEM, confirmAt: { $exists: true } }
        });
        if (!user) {
            throw new error_response_1.Notfound("invalid account due to one of the following reasons [not registerd , invalid provider ,not confirmed]");
        }
        const otp = (0, otp_1.generateNumberOtp)();
        const result = await this.userModel.updateOne({
            filter: { email },
            update: {
                resetPasswordOtp: await (0, hash_security_1.generateHash)(String(otp))
            }
        });
        if (!result.matchedCount) {
            throw new error_response_1.BadReauest("fail to send the reset code please try again later");
        }
        email_event_1.emailEvent.emit("resetPassword", {
            to: email,
            otp
        });
        return res.status(200).json({
            message: "Done",
        });
    };
    verifyForgotPasseordCode = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, provider: User_model_1.providerEnm.SYSTEM, resetPasswordOtp: { $exists: true } }
        });
        if (!user) {
            throw new error_response_1.Notfound("invalid account due to one of the following reasons [not registerd , invalid provider ,not confirmed,missing resetpasswordotp]");
        }
        if (!(await (0, hash_security_1.CompareHash)(otp, user.resetPasswordOtp))) {
            throw new error_response_1.ConflictException("invalid otp");
        }
        return res.status(200).json({
            message: "Done",
        });
    };
    resetForgotPasseordCode = async (req, res) => {
        const { email, otp, password } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, provider: User_model_1.providerEnm.SYSTEM, resetPasswordOtp: { $exists: true } }
        });
        if (!user) {
            throw new error_response_1.Notfound("invalid account due to one of the following reasons [not registerd , invalid provider ,not confirmed,missing resetpasswordotp]");
        }
        if (!(await (0, hash_security_1.CompareHash)(otp, user.resetPasswordOtp))) {
            throw new error_response_1.ConflictException("invalid otp");
        }
        const result = await this.userModel.updateOne({
            filter: { email },
            update: {
                password: await (0, hash_security_1.generateHash)(password),
                $unset: { resetPasswordOtp: 1 },
                changeCredentialTime: new Date()
            }
        });
        if (!result.matchedCount) {
            throw new error_response_1.BadReauest("fail to reset the acc password");
        }
        return res.status(200).json({
            message: "Done",
        });
    };
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map