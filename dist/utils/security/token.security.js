"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarteToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generarteToken = async ({ payload, secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) } }) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generarteToken = generarteToken;
//# sourceMappingURL=token.security.js.map