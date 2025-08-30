"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareHash = exports.generateHash = void 0;
const bcrypt_1 = require("bcrypt");
const generateHash = async (plaintext, salt = Number(process.env.SALT)) => {
    return await (0, bcrypt_1.hash)(plaintext, salt);
};
exports.generateHash = generateHash;
const CompareHash = async (plaintext, hash) => {
    return await (0, bcrypt_1.compare)(plaintext, hash);
};
exports.CompareHash = CompareHash;
//# sourceMappingURL=hash.security.js.map