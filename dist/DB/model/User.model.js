"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.providerEnm = exports.RoleEnum = exports.GenderEnum = void 0;
const mongoose_1 = require("mongoose");
const hash_security_1 = require("../../utils/security/hash.security");
const email_event_1 = require("./../../utils/event/email.event");
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["male"] = "male";
    GenderEnum["female"] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["user"] = "user";
    RoleEnum["admin"] = "admin";
    RoleEnum["superAdmin"] = "superAdmin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var providerEnm;
(function (providerEnm) {
    providerEnm["GOOGLE"] = "GOOGLE";
    providerEnm["SYSTEM"] = "SYSTEM";
})(providerEnm || (exports.providerEnm = providerEnm = {}));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, minLength: 2, maxLength: 25 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 25 },
    slug: { type: String, required: false, minLength: 2, maxLength: 51 },
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
userSchema.virtual("username")
    .set(function (value) {
    const [firstName = "", lastName = ""] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
    this.slug = value.trim().replace(/\s+/g, "-").toLowerCase();
})
    .get(function () {
    return `${this.firstName ?? ""} ${this.lastName ?? ""}`.trim();
});
userSchema.pre("save", async function (next) {
    this.wasNew = this.isNew;
    if (this.isModified("password")) {
        this.password = await (0, hash_security_1.generateHash)(this.password);
    }
    if (this.isModified("confrimEmailOtp")) {
        this.confirmEmailPlainOtp = this.confrimEmailOtp;
        this.confrimEmailOtp = await (0, hash_security_1.generateHash)(this.confrimEmailOtp);
    }
    next();
});
userSchema.post("save", async function (doc, next) {
    const that = this;
    if (that.wasNew && that.confirmEmailPlainOtp) {
        email_event_1.emailEvent.emit("confirmEmail", { to: this.email, otp: that.confirmEmailPlainOtp });
    }
    next();
});
userSchema.pre(["find", "findOne"], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=User.model.js.map