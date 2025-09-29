"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const database_repository_1 = require("./database.repository");
class ChatRepository extends database_repository_1.DataBaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=chat.repository.js.map