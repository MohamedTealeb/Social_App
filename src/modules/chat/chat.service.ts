import { ISayHiDto } from "./chat.dto";

export class ChatService{
constructor(){}


sayHi=({message,socket,callback,io}:ISayHiDto)=>{

    try{
        console.log({message})
        if(callback){
    callback('BE To FE')
        }


        callback? callback("hello BE from FE") :undefined
    }catch(error){
     return socket.emit("custom_error",error)


}


}
}