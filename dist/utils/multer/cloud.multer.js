"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudFileUpload = exports.fileValidation = exports.storaeEnum = void 0;
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const error_response_1 = require("../../utils/response/error.response");
const node_os_1 = __importDefault(require("node:os"));
var storaeEnum;
(function (storaeEnum) {
    storaeEnum["memory"] = "memory";
    storaeEnum["disk"] = "disk";
})(storaeEnum || (exports.storaeEnum = storaeEnum = {}));
exports.fileValidation = {
    image: ['image/jpeg', 'image/png', 'image/gif']
};
const cloudFileUpload = ({ validation = [], storageApproach = storaeEnum.memory, maxSizeMB = 2 }) => {
    const storage = storageApproach === storaeEnum.memory ? multer_1.default.memoryStorage() : multer_1.default.diskStorage({
        destination: node_os_1.default.tmpdir(),
        filename: function (req, file, callback) {
            callback(null, `${(0, uuid_1.v4)()}_${file.originalname}`);
        }
    });
    function fileFilter(req, file, callback) {
        if (!validation.includes(file.mimetype)) {
            return callback(new error_response_1.BadReauest("validation error", { validationError: [{ key: "file", issues: [{ path: "file", message: "invalid file format" }] }] }));
        }
        return callback(null, true);
    }
    return (0, multer_1.default)({ fileFilter, limits: { fileSize: maxSizeMB * 1024 * 1024 }, storage });
};
exports.cloudFileUpload = cloudFileUpload;
//# sourceMappingURL=cloud.multer.js.map