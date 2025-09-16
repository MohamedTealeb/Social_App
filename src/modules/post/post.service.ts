import { Request, Response } from "express";
import { PostRepository } from "../../DB/repository/post.repository";
import { PostModel } from "../../DB/model/post.model";
import { UserRepository } from "../../DB/repository/user.reository";
import { UserModel } from "../../DB/model/User.model";


class PostService{
    private userModel= new UserRepository(UserModel)
    private postModel= new PostRepository(PostModel)
  constructor(){}


  createPost=async(req:Request,res:Response):Promise<Response>=>{
return res.json({
    
})

  }


}
export default new PostService()