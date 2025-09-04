"use strict";
// import {v4 as uuiid}from'uuid'
// import {ObjectCannedACL, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
// import { storaeEnum } from './cloud.multer'
// import { createReadStream } from 'node:fs'
// import { BadReauest } from 'response/error.response'
Object.defineProperty(exports, "__esModule", { value: true });
// export const s3Config=()=>{
//     return new S3Client({
//         region:process.env.AWS_REGION as string,
//         credentials:{
//             accessKeyId:process.env.AWS_ACCESS_KEY_ID as string,
//             secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY as string
//         }
//     })
// }
// export const uploadFile=async({  storageApproach=storaeEnum.memory,Bucket =process.env.AWS_BUCKET_NAME,
//         ACL="private",
//         path="general",
//     file}:{
//         storageApproach?:storaeEnum
//               Bucket?:string
//         ACL?:ObjectCannedACL
//         path:string
//         file:Express.Multer.File
//         }):Promise<string>=>{
//     const command=new PutObjectCommand({
//         Bucket,
//         ACL,
//         Key:`${process.env.APPLICATION_NAME}/${path}/${uuiid()}_${
//             file.originalname
//         }`,
//         Body:storageApproach===storaeEnum.memory?file.buffer:createReadStream(file.path),
//         ContentType:file.mimetype,
//     })
//     await s3Config().send(command)
//     if(!command?.input?.Key){
//         throw new BadReauest("faild togenerate  upload  key")
//     }
//     return command.input.Key
// }
//# sourceMappingURL=s3.config.js.map