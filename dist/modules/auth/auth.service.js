"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthenticationService {
    constructor() { }
    signup = (req, res, next) => {
        return res.status(201).json({
            message: "Done",
            data: req.body
        });
    };
    login = (req, res, next) => {
        return res.status(200).json({
            message: "Done",
            data: req.body
        });
    };
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map