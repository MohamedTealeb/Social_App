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
    async paginte({ filter = {}, options = {}, select, page = 1, size = 5, }) {
        let decsCount = undefined;
        let pages = undefined;
        if (page != "all") {
            pages = Math.floor(page < 1 ? 1 : page);
            options.limit = Math.floor(size < 1 || !size ? 5 : size);
            options.skip = Math.floor((pages - 1) * options.limit);
            decsCount = await this.model.countDocuments(filter);
            pages = Math.ceil(decsCount / options.limit);
        }
        const resault = await this.model.find(filter, select, options);
        return {
            decsCount: decsCount || 0,
            limit: options.limit || 0,
            pages: pages || 0,
            currentPage: typeof page === 'number' ? Math.floor(page < 1 ? 1 : page) : 1,
            resault
        };
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
    async findOneAndUpdate({ filter, update, options = { new: true }, }) {
        return this.model.findOneAndUpdate(filter, {
            ...update, $inc: { __v: 1 }
        }, options);
    }
    async create({ data, options, }) {
        if (options) {
            const created = await this.model.create([data], options);
            return created[0];
        }
        else {
            return await this.model.create(data);
        }
    }
    async createMany({ data, options, }) {
        return await this.model.create(data, options);
    }
    async updateOne({ filter, update, options }) {
        return await this.model.updateOne(filter, { ...update, $inc: { __v: 1 } }, options);
    }
}
exports.DataBaseRepository = DataBaseRepository;
//# sourceMappingURL=database.repository.js.map