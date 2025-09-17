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
    async find({ filter, select, options, }) {
        return this.model
            .find(filter ?? {}, null, options)
            .select(select ?? "")
            .exec();
    }
    async findByIdAndUpdate({ id, update, options = { new: true }, }) {
        return this.model.findByIdAndUpdate(id, {
            ...update, $inc: { __v: 1 }
        }, options);
    }
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
    async updateOne({ filter, update, options }) {
        return await this.model.updateOne(filter, { ...update, $inc: { __v: 1 } }, options);
    }
}
exports.DataBaseRepository = DataBaseRepository;
//# sourceMappingURL=database.repository.js.map