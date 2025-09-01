"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.providerEnm = exports.RoleEnum = exports.GenderEnum = void 0;
const mongoose_1 = require("mongoose");
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["male"] = "male";
    GenderEnum["female"] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["user"] = "user";
    RoleEnum["admin"] = "admin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var providerEnm;
(function (providerEnm) {
    providerEnm["GOOGLE"] = "GOOGLE";
    providerEnm["SYSTEM"] = "SYSTEM";
})(providerEnm || (exports.providerEnm = providerEnm = {}));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, minLength: 2, maxLength: 25 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 25 },
    email: { type: String, required: true, unique: true },
    confrimEmailOtp: { type: String },
    confirmAt: { type: Date },
    password: { type: String, required: function () {
            return this.provider === providerEnm.GOOGLE ? false : true;
        } },
    resetPasswordOtp: { type: String },
    changeCredentialTime: { type: Date },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: GenderEnum, default: GenderEnum.male },
    role: { type: String, enum: RoleEnum, default: RoleEnum.user },
    provider: { type: String, enum: providerEnm, default: providerEnm.SYSTEM },
    profileImage: { type: String },
    coverImages: [String]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
userSchema.virtual("username").set(function (value) {
    const [firstName, LastName] = value.split(" ") || [];
    this.set({ firstName, LastName });
}).get(function () {
    return this.firstName + " " + this.lastName;
});
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=User.model.js.map