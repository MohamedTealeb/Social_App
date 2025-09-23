import { Request, Response } from "express";
import { PostRepository } from "../../DB/repository/post.repository";
import { availabilityEnum, PostModel } from "../../DB/model/post.model";
import { UserRepository } from "../../DB/repository/user.reository";
import { UserModel } from "../../DB/model/User.model";
import { Notfound } from "../../utils/response/error.response";
import { Types } from "mongoose";
import { CommentRepository } from "../../DB/repository/comment.repository";
import { CommentModel } from "../../DB/model/comment.model";
export const postAvailability = (req: Request) => {
  return [
    {availability:availabilityEnum.public},
    {availability:availabilityEnum.friends,createdBy:req.user?._id},
    {availability:availabilityEnum.onlyMe,createdBy:req.user?._id},
    {availability:availabilityEnum.onlyMe,createdBy:req.user?._id,tags:{$in:[req.user?._id]}}
  ]
}


class PostService {
  private userModel = new UserRepository(UserModel);
  private postModel = new PostRepository(PostModel);
  private commentModel = new CommentRepository(CommentModel);
  
  constructor() {}

  createPost = async (req: Request, res: Response): Promise<Response> => {
    let processedTags: string[] = [];
    if (req.body.tags?.length) {
      processedTags = req.body.tags.map((tag: any) => {
        if (typeof tag === 'object' && tag.userId) {
          return tag.userId;
        }
        return tag;
      });
    }

    if (
      processedTags.length &&
      (await this.userModel.find({ filter: { _id: { $in: processedTags } } })).length !==
        processedTags.length
    ) {
      throw new Notfound("Some of the mentioned users do not exist");
    }
    
    
    const postData = {
      ...req.body,
      tags: processedTags
    };
    
    const post = await this.postModel.create({ data: postData });
    return res.status(201).json(post);
  };
    likePost = async(req: Request, res: Response): Promise<Response> => {
        const { postId } = req.params;
        const { userId } = req.body;

        if (!postId) {
            throw new Notfound("Post ID is required");
        }

        if (!userId) {
            throw new Notfound("User ID is required");
        }

        
        if (!Types.ObjectId.isValid(postId)) {
            throw new Notfound("Invalid Post ID format");
        }

        if (!Types.ObjectId.isValid(userId)) {
            throw new Notfound("Invalid User ID format");
        }

        
        const existingPost = await this.postModel.findOne({ filter: { _id: new Types.ObjectId(postId) } });
        if (!existingPost) {
            throw new Notfound("Post not found");
        }

       
        const userObjectId = new Types.ObjectId(userId);
        const isLiked = existingPost.likes?.some(likeId => likeId.toString() === userObjectId.toString()) || false;
        
        let updatedPost;
        if (isLiked) {
           
            updatedPost = await this.postModel.findByIdAndUpdate({
                id: new Types.ObjectId(postId),
                update: { $pull: { likes: userObjectId } },
                options: { new: true }
            });
        } else {
           
            updatedPost = await this.postModel.findByIdAndUpdate({
                id: new Types.ObjectId(postId),
                update: { $addToSet: { likes: userObjectId } },
                options: { new: true }
            });
        }

        return res.status(200).json({
            success: true,
            message: isLiked ? "Post unliked successfully" : "Post liked successfully",
            post: updatedPost,
            isLiked: !isLiked
        });
    }

    updatePost = async (req: Request, res: Response): Promise<Response> => {
        const { postId } = req.params;
        const { userId } = req.body;
        
        if (!postId) {
            throw new Notfound("Post ID is required");
        }

        if (!Types.ObjectId.isValid(postId)) {
            throw new Notfound("Invalid Post ID format");
        }

        // Check if post exists
        const existingPost = await this.postModel.findOne({ 
            filter: { _id: new Types.ObjectId(postId) } 
        });
        
        if (!existingPost) {
            throw new Notfound("Post not found");
        }

        // Check if user is the owner of the post
        if (existingPost.createdBy?.toString() !== userId) {
            throw new Notfound("You are not authorized to update this post");
        }

        // Handle tags validation if tags are being updated
        let processedTags: string[] = [];
        if (req.body.tags?.length) {
            processedTags = req.body.tags.map((tag: any) => {
                if (typeof tag === 'object' && tag.userId) {
                    return tag.userId;
                }
                return tag;
            });

            // Validate that all tagged users exist
            if (
                processedTags.length &&
                (await this.userModel.find({ filter: { _id: { $in: processedTags } } })).length !==
                    processedTags.length
            ) {
                throw new Notfound("Some of the mentioned users do not exist");
            }
        }

        // Prepare update data
        const updateData: any = { ...req.body };
        if (req.body.tags?.length) {
            updateData.tags = processedTags;
        }

        // Remove userId from update data as it shouldn't be updated
        delete updateData.userId;

        // Update the post
        const updatedPost = await this.postModel.findByIdAndUpdate({
            id: new Types.ObjectId(postId),
            update: updateData,
            options: { new: true }
        });

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost
        });
    }
    postList = async (req: Request, res: Response): Promise<Response> => {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 5;
      
      const posts = await this.postModel.findcursor({
        filter:{
          $or:postAvailability(req)
        },
        page,
        size
      });
      
      return res.status(200).json({
        success: true,
        message: "Posts retrieved successfully",
        ...posts
      });
    }

    getPostById = async (req: Request, res: Response): Promise<Response> => {
      const { postId } = req.params as unknown as { postId: Types.ObjectId };

      if (!postId) {
        throw new Notfound("Post ID is required");
      }
      if (!Types.ObjectId.isValid(postId)) {
        throw new Notfound("Invalid Post ID format");
      }

      const post = await this.postModel.findOne({
        filter: { _id: new Types.ObjectId(postId), $or: postAvailability(req) },
        options: { populate: [{ path: "comments" }] }
      });

      if (!post) {
        throw new Notfound("Post not found");
      }

      return res.status(200).json({
        success: true,
        post
      });
    }

    freezePost = async (req: Request, res: Response): Promise<Response> => {
        const { postId } = req.params;
        

        if (!postId) {
            throw new Notfound("Post ID is required");
        }
       
        if (!Types.ObjectId.isValid(postId)) {
            throw new Notfound("Invalid Post ID format");
        }
        

        const existingPost = await this.postModel.findOne({
            filter: { _id: new Types.ObjectId(postId) }
        });
        if (!existingPost) {
            throw new Notfound("Post not found");
        }

      
        const updatedPost = await this.postModel.findByIdAndUpdate({
            id: new Types.ObjectId(postId),
            update: {
                freezedBy: new Types.ObjectId(req.user?._id),
                freezedAt: new Date(),
                restoredAt: undefined,
                restoredBy: undefined
            },
            options: { new: true }
        });

        return res.status(200).json({
            success: true,
            message: "Post freezed successfully",
            post: updatedPost
        });
    }

    hardDeletePost = async (req: Request, res: Response): Promise<Response> => {
        const { postId } = req.params;
      

        if (!postId) {
            throw new Notfound("Post ID is required");
        }
        
        if (!Types.ObjectId.isValid(postId)) {
            throw new Notfound("Invalid Post ID format");
        }
       

        const existingPost = await this.postModel.findOne({
            filter: { _id: new Types.ObjectId(postId) }
        });
        if (!existingPost) {
            throw new Notfound("Post not found");
        }

    

        await CommentModel.deleteMany({ postId: new Types.ObjectId(postId) });
        await PostModel.deleteOne({ _id: new Types.ObjectId(postId) });

        return res.status(200).json({
            success: true,
            message: "Post deleted permanently"
        });
    }

}

export default new PostService();