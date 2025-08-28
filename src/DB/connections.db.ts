import{connect} from "mongoose"
import { UserModel } from "./model/User.model";
const connectDB=async():Promise<void>=>{
    try{
  const result = await connect(process.env.DB_URL as string,{
    serverSelectionTimeoutMS:3000
  })
  await UserModel.syncIndexes()
  console.log(result.models);
    console.log("DB CONNECTED");
  
    }catch(error){
        console.log("DB CONNECTION ERROR",error);
        
    }
}
export default connectDB