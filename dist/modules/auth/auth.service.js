"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// import {  BadReauest } from '../../utils/response/error.response';
const validators = __importStar(require("./auth.validation"));
class AuthenticationService {
    constructor() { }
    signup = (req, res) => {
        try {
            validators.signup.body.parse(req.body);
        }
        catch (error) {
            return res.status(201).json({
                error, messsage: JSON.parse(error)
            });
        }
        let { username, email, password, phone, gender } = req.body;
        console.log({ username, email, password, phone, gender });
        // throw new BadReauest("Fail in auth",400);
        return res.status(201).json({
            message: "User created successfully",
            data: req.body
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