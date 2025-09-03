import {v4 as uuid}from 'uuid'
import multer, { FileFilterCallback } from "multer";
import { BadReauest } from "../../utils/response/error.response";
import { Request } from "express";
import os from 'node:os'

export enum storaeEnum{
    memory="memory",
    disk="disk"
} 
export const fileValidation ={
    image:['image/jpeg','image/png','image/gif']
}
export const cloudFileUpload=({validation=[],storageApproach=storaeEnum.memory,maxSizeMB=2}:{validation?:string[],storageApproach?:storaeEnum,maxSizeMB?:number}):multer.Multer=>{

    const storage=storageApproach=== storaeEnum.memory? multer.memoryStorage():multer.diskStorage({
        destination:os.tmpdir(),
        filename:function(req:Request,file:Express.Multer.File,callback){
            callback(null,`${uuid()}_${file.originalname}`)
        }

    })

    function fileFilter(req:Request,file:Express.Multer.File,callback:FileFilterCallback){
        if(!validation.includes(file.mimetype)){
           return callback(new BadReauest("validation error",{validationError:[{key:"file",issues:[{path:"file",message:"invalid file format"}]}]}))
        }
        return callback(null,true)
    }

    return multer({fileFilter,limits:{fileSize:maxSizeMB *1024*1024},storage})
}