"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.createLoginCredentaails = exports.getSignature = exports.detectSignatureLevel = exports.verifyrteToken = exports.generarteToken = exports.LogoutEnum = exports.TokenEnum = exports.SignatureLevelEnum = void 0;
const uuid_1 = require("uuid");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_model_1 = require("../../DB/model/User.model");
const error_response_1 = require("../response/error.response");
const user_reository_1 = require("../../DB/repository/user.reository");
const token_repository_1 = require("../../DB/repository/token.repository");
const Token_model_1 = require("../../DB/model/Token.model");
var SignatureLevelEnum;
(function (SignatureLevelEnum) {
    SignatureLevelEnum["Bearer"] = "Bearer";
    SignatureLevelEnum["System"] = "System";
})(SignatureLevelEnum || (exports.SignatureLevelEnum = SignatureLevelEnum = {}));
var TokenEnum;
(function (TokenEnum) {
    TokenEnum["access"] = "access";
    TokenEnum["refresh"] = "refresh";
})(TokenEnum || (exports.TokenEnum = TokenEnum = {}));
var LogoutEnum;
(function (LogoutEnum) {
    LogoutEnum["only"] = "only";
    LogoutEnum["all"] = "all";
})(LogoutEnum || (exports.LogoutEnum = LogoutEnum = {}));
const generarteToken = async ({ payload, secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) } }) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generarteToken = generarteToken;
const verifyrteToken = async ({ token, secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, }) => {
    return (0, jsonwebtoken_1.verify)(token, secret);
};
exports.verifyrteToken = verifyrteToken;
const detectSignatureLevel = async (role = User_model_1.RoleEnum.user) => {
    let signatureLevel = SignatureLevelEnum.Bearer;
    switch (role) {
        case User_model_1.RoleEnum.admin:
            signatureLevel = SignatureLevelEnum.System;
            break;
        default:
            signatureLevel = SignatureLevelEnum.Bearer;
            break;
    }
    return signatureLevel;
};
exports.detectSignatureLevel = detectSignatureLevel;
const getSignature = async (signatureLevel = SignatureLevelEnum.Bearer) => {
    let signature = {
        access_signature: "",
        refresh_signature: ""
    };
    switch (signatureLevel) {
        case SignatureLevelEnum.System:
            signature.access_signature = process.env.ACCESS_SYSYEM_TOKEN_SIGNATURE;
            signature.refresh_signature = process.env.REFRESH_SYSYEM_TOKEN_SIGNATURE;
            break;
        default:
            signature.access_signature = process.env.ACCESS_USER_TOKEN_SIGNATURE;
            signature.refresh_signature = process.env.REFRESH_USER_TOKEN_SIGNATURE;
            break;
    }
    return signature;
};
exports.getSignature = getSignature;
const createLoginCredentaails = async (user) => {
    const signatureLevel = await (0, exports.detectSignatureLevel)(user.role);
    const signatures = await (0, exports.getSignature)(signatureLevel);
    const jwtid = (0, uuid_1.v4)();
    const access_token = await (0, exports.generarteToken)({
        payload: { _id: user._id },
        secret: signatures.access_signature,
        options: { expiresIn: Number(process.env.Access_TOKEN_EXPIRES_IN), jwtid }
    });
    const refresh_token = await (0, exports.generarteToken)({
        payload: { _id: user._id },
        secret: signatures.refresh_signature,
        options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN), jwtid }
    });
    return { access_token, refresh_token };
};
exports.createLoginCredentaails = createLoginCredentaails;
const decodeToken = async ({ authorization, tokenType = TokenEnum.access }) => {
    const userModel = new user_reository_1.UserRepository(User_model_1.UserModel);
    const tokenModel = new token_repository_1.TokenRepository(Token_model_1.TokenModel);
    const [bearerKey, token] = authorization.split(" ");
    if (!bearerKey || !token) {
        throw new error_response_1.UnauthorizedException("missing token parts");
    }
    const signatures = await (0, exports.getSignature)(bearerKey);
    const decoded = await (0, exports.verifyrteToken)({
        token,
        secret: tokenType === TokenEnum.refresh ? signatures.refresh_signature : signatures.access_signature,
    });
    if (!decoded?._id || !decoded?.iat) {
        throw new error_response_1.BadReauest("invalid token payload");
    }
    if (await tokenModel.findOne({
        filter: { jti: decoded.jti }
    })) {
        throw new error_response_1.UnauthorizedException("invalid or old login credentials");
    }
    const user = await userModel.findOne({
        filter: {
            _id: decoded._id
        }
    });
    if (!user) {
        throw new error_response_1.BadReauest("not register acc");
    }
    if (user.changeCredentialTime?.getTime() || 0 > decoded.iat * 1000) {
        throw new error_response_1.UnauthorizedException("invalid or old login credentials");
    }
    return { user, decoded };
};
exports.decodeToken = decodeToken;
//# sourceMappingURL=token.security.js.map