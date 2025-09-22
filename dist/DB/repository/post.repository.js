"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const database_repository_1 = require("./database.repository");
const comment_model_1 = require("./../model/comment.model");
const comment_repository_1 = require("./comment.repository");
class PostRepository extends database_repository_1.DataBaseRepository {
    model;
    commentModel = new comment_repository_1.CommentRepository(comment_model_1.CommentModel);
    constructor(model) {
        super(model);
        this.model = model;
    }
    async findcursor({ filter, select, options, page = 1, size = 5, }) {
        let resault = [];
        let decsCount = undefined;
        let pages = undefined;
        let limit = undefined;
        let currentPage = 1;
        if (page != "all") {
            currentPage = Math.floor(page < 1 ? 1 : page);
            limit = Math.floor(size < 1 || !size ? 5 : size);
            const skip = Math.floor((currentPage - 1) * limit);
            decsCount = await this.model.countDocuments(filter ?? {});
            pages = Math.ceil(decsCount / limit);
            // Use regular find with limit and skip instead of cursor
            const docs = await this.model
                .find(filter ?? {}, null, { ...options, limit, skip })
                .select(select ?? "")
                .populate(options?.populate)
                .exec();
            for (let doc of docs) {
                const comments = await this.commentModel.find({
                    filter: { postId: doc._id, commentId: { $exists: false } },
                    options: { populate: [{ path: "reply" }] }
                });
                resault.push({ post: doc, comments });
            }
        }
        else {
            // For "all", use cursor without limit
            const cursor = this.model
                .find(filter ?? {}, null, options)
                .select(select ?? "").populate(options?.populate).cursor();
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                const comments = await this.commentModel.find({
                    filter: { postId: doc._id, commentId: { $exists: false } },
                    options: { populate: [{ path: "reply" }] }
                });
                resault.push({ post: doc, comments });
            }
        }
        return {
            decsCount: decsCount || 0,
            limit: limit || 0,
            pages: pages || 0,
            currentPage,
            resault
        };
    }
}
exports.PostRepository = PostRepository;
//# sourceMappingURL=post.repository.js.map