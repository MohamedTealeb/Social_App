"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = exports.availabilityEnum = exports.allowCommentsEnum = void 0;
const mongoose_1 = require("mongoose");
var allowCommentsEnum;
(function (allowCommentsEnum) {
    allowCommentsEnum["allow"] = "allow";
    allowCommentsEnum["deny"] = "deny";
})(allowCommentsEnum || (exports.allowCommentsEnum = allowCommentsEnum = {}));
var availabilityEnum;
(function (availabilityEnum) {
    availabilityEnum["public"] = "public";
    availabilityEnum["friends"] = "friends";
    availabilityEnum["onlyMe"] = "only-me";
})(availabilityEnum || (exports.availabilityEnum = availabilityEnum = {}));
const postSchema = new mongoose_1.Schema({
    content: {
        type: String, minlength: 2, maxlength: 50000, required: function () {
            return !this.attachements?.length;
        }
    },
    attachements: [String],
    assetsFolderId: { type: String, required: true },
    availability: { type: String, enum: availabilityEnum, default: availabilityEnum.public },
    allowComments: { type: String, enum: allowCommentsEnum, default: allowCommentsEnum.allow },
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    freezedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    freezedAt: Date,
    restoredAt: Date,
    restoredBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true
});
exports.PostModel = mongoose_1.models.Post || (0, mongoose_1.model)("Post", postSchema);
//# sourceMappingURL=post.model.js.map