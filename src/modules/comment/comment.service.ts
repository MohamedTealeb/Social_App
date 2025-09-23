import { Request, Response } from "express";
import { CommentRepository } from "../../DB/repository/comment.repository";
import { PostRepository } from "../../DB/repository/post.repository";
import { allowCommentsEnum, PostModel } from "../../DB/model/post.model";
import { CommentModel } from "../../DB/model/comment.model";
import { Types } from "mongoose";
import { postAvailability } from "../post/post.service";
import { Notfound } from "../../utils/response/error.response"


 class CommentService {
    private commentModel=new CommentRepository(CommentModel)
    private postModel=new PostRepository(PostModel)
    constructor(){}

    createComment = async (req: Request, res: Response): Promise<Response> => {
      const {postId}=req.params as unknown as {postId:Types.ObjectId}
      const post =await this.postModel.findOne({filter:{_id:postId,allowComments:allowCommentsEnum.allow,$or:postAvailability(req)}})
      if(!post){
        throw new Notfound("Post not found")
      }

    const comment=await this.commentModel.create({data:{
      ...req.body,
      postId,
      createdBy:req.user?._id
    }})
      
        
      
        return res.status(201).json(comment);
      };
      replyComment = async (req: Request, res: Response): Promise<Response> => {
        const { postId, commentId } = req.params as unknown as {
          postId: Types.ObjectId;
          commentId: Types.ObjectId;
        };
      
        const comment = await this.commentModel.findOne({
          filter: { _id: commentId, postId }
        });
      
        if (!comment) {
          throw new Notfound("comment not found");
        }

        // Check if the post allows comments
        const post = await this.postModel.findOne({
          filter: { _id: postId, allowComments: allowCommentsEnum.allow, $or: postAvailability(req) }
        });

        if (!post) {
          throw new Notfound("Post not found or comments not allowed");
        }
      
        const reply = await this.commentModel.create({
          data: {
            ...req.body,
            postId,
            commentId: commentId,
            createdBy: req.user?._id,
          }
        });
      
        return res.status(201).json(reply);
      };
      updateComment = async (req: Request, res: Response): Promise<Response> => {
        const {  commentId } = req.params as unknown as {
       
          commentId: Types.ObjectId;
        };

        const comment = await this.commentModel.findOne({
          filter: { _id: commentId}
        });
        if (!comment) {
          throw new Notfound("comment not found");
        }

        const updated = await this.commentModel.findOneAndUpdate({
          filter: { _id: commentId },
          update: { ...req.body },
          options: { new: true }
        });
        return res.status(200).json(updated);
      };

      freezeComment = async (req: Request, res: Response): Promise<Response> => {
        const {  commentId } = req.params as unknown as {
         
          commentId: Types.ObjectId;
        };

        const comment = await this.commentModel.findOne({
          filter: { _id: commentId }
        });
        if (!comment) {
          throw new Notfound("comment not found");
        }

        const updated = await this.commentModel.findOneAndUpdate({
          filter: { _id: commentId },
          update: {
            freezedBy: req.user?._id as unknown as Types.ObjectId,
            freezedAt: new Date(),
            restoredAt: undefined,
            restoredBy: undefined
          },
          options: { new: true }
        });
        return res.status(200).json({
          success: true,
          message: "Comment freezed successfully",
          comment: updated
        });
      };

      hardDeleteComment = async (req: Request, res: Response): Promise<Response> => {
        const { postId, commentId } = req.params as unknown as {
          postId: Types.ObjectId;
          commentId: Types.ObjectId;
        };

        const comment = await this.commentModel.findOne({
          filter: { _id: commentId, postId }
        });
        if (!comment) {
          throw new Notfound("comment not found");
        }

        await CommentModel.deleteMany({
          $or: [
            { _id: commentId },
            { commentId }
          ]
        });

        return res.status(200).json({
          success: true,
          message: "Comment deleted permanently"
        });
      };

      getCommentById = async (req: Request, res: Response): Promise<Response> => {
        const {  commentId } = req.params as unknown as {
          
          commentId: Types.ObjectId;
        };
        const comment = await this.commentModel.findOne({
          filter: { _id: commentId }
        });
        if (!comment) {
          throw new Notfound("comment not found");
        }
        return res.status(200).json(comment);
      };

      getCommentWithReply = async (req: Request, res: Response): Promise<Response> => {
        const {  commentId } = req.params as unknown as {
          
          commentId: Types.ObjectId;
        };
        const comment = await this.commentModel.findOne({
          filter: { _id: commentId },
          options: { populate: [{ path: "reply" ,populate:{path:"createdBy",select:"_id username"}}] }
        });
        if (!comment) {
          throw new Notfound("comment not found");
        }
        return res.status(200).json(comment);
      };
      
 }

 export default new CommentService()