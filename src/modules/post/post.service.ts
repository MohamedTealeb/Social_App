import { Request, Response } from "express";
import { PostRepository } from "../../DB/repository/post.repository";
import { availabilityEnum, PostModel } from "../../DB/model/post.model";
import { UserRepository } from "../../DB/repository/user.reository";
import { UserModel } from "../../DB/model/User.model";
import { Notfound } from "../../utils/response/error.response";
import { Types } from "mongoose";
export const postAvailability=(req:Request)=>{

return [
                      {availability:availabilityEnum.public},
                      {availability:availabilityEnum.friends,createdBy:{$in:[...(req.user?.friends||[]),req.user?._id]}},
                      {availability:{$ne:availabilityEnum.onlyMe},tags:{$in:[req.user?._id]}},
                      {availability:availabilityEnum.onlyMe,createdBy:req.user?._id}
                    ]


}

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
           
            updatedPost = await this.postModel.updateOne({
                filter: {
                    _id: new Types.ObjectId(postId),
                    $or:postAvailability(req)
                },
                update: { $pull: { likes: userObjectId } }
            });
        } else {
           
            await this.postModel.updateOne({
                filter: { _id: new Types.ObjectId(postId) },
                update: { $addToSet: { likes: userObjectId } }
            });
        }

        // Fetch the updated post
        updatedPost = await this.postModel.findOne({ filter: { _id: new Types.ObjectId(postId) } });

        return res.status(200).json({
            success: true,
            message: isLiked ? "Post unliked successfully" : "Post liked successfully",
            post: updatedPost,
            isLiked: !isLiked
        });
    }



}

export default new PostService();