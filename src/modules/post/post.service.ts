import { Request, Response } from "express";
import { PostRepository } from "../../DB/repository/post.repository";
import { PostModel } from "../../DB/model/post.model";
import { UserRepository } from "../../DB/repository/user.reository";
import { UserModel } from "../../DB/model/User.model";
import { Notfound } from "../../utils/response/error.response";
import { Types } from "mongoose";


class PostService {
  private userModel = new UserRepository(UserModel);
  private postModel = new PostRepository(PostModel);
  
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

}

export default new PostService();