"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User_model_1 = require("./model/User.model");
const connectDB = async () => {
    try {
        const result = await (0, mongoose_1.connect)(process.env.DB_URL, {
            serverSelectionTimeoutMS: 3000
        });
        await User_model_1.UserModel.syncIndexes();
        console.log(result.models);
        console.log("DB CONNECTED");
    }
    catch (error) {
        console.log("DB CONNECTION ERROR", error);
    }
};
exports.default = connectDB;
//# sourceMappingURL=connections.db.js.map