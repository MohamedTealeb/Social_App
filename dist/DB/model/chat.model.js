"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHatModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    content: { type: String, required: true, minlength: 3, maxlength: 10000 },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true,
});
const chatSchema = new mongoose_1.Schema({
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    group: { type: String },
    group_image: { type: String },
    roomId: { type: String, required: function () {
            return this.roomId;
        } },
    messages: [messageSchema]
}, {
    timestamps: true,
});
exports.CHatModel = mongoose_1.models.Chat || (0, mongoose_1.model)("Chat", chatSchema);
//# sourceMappingURL=chat.model.js.map