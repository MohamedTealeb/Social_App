"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_repository_1 = require("./database.repository");
const error_response_1 = require("../../utils/response/error.response");
class UserRepository extends database_repository_1.DataBaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    async creaeUser({ data, options, }) {
        const [user] = await this.create({ data, options }) || [];
        if (!user) {
            throw new error_response_1.BadReauest("fail to create this user");
        }
        return [user];
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.reository.js.map