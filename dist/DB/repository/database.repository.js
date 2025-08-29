"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseRepository = void 0;
class DataBaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne({ filter, select }) {
        return await this.model.findOne(filter).select(select || "");
    }
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
}
exports.DataBaseRepository = DataBaseRepository;
//# sourceMappingURL=database.repository.js.map