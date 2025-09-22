"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestModel = void 0;
const mongoose_1 = require("mongoose");
const friendRequestSchema = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    sendTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    acceptedAt: Date,
}, {
    timestamps: true,
    strictQuery: true
});
exports.FriendRequestModel = mongoose_1.models.FriendRequest || (0, mongoose_1.model)("FriendRequest", friendRequestSchema);
//# sourceMappingURL=friendRequest.model.js.map