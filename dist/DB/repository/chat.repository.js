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
    async findOneChat({ filter, select, options, page = 1, size = 5, }) {
        let decsCount = undefined;
        let pages = undefined;
        if (page !== "all") {
            const limit = Math.floor(size && size > 0 ? size : 5);
            const currentPage = Math.max(1, Number(page));
            decsCount = await this.model.countDocuments(filter);
            pages = Math.ceil(decsCount / limit);
            if (options) {
                options.limit = limit;
                options.skip = (currentPage - 1) * limit;
            }
        }
        const sliceValue = page === "all"
            ? undefined
            : [(Math.max(1, Number(page)) - 1) * size, size];
        let query = this.model
            .findOne(filter ?? {}, null, options ?? undefined)
            .select({
            ...(typeof select === "object" ? select : {}),
            ...(sliceValue ? { messages: { $slice: sliceValue } } : {}),
        });
        if (options?.populate) {
            query = query.populate(options.populate);
        }
        return (await query);
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=chat.repository.js.map