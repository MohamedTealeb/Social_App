import multer from "multer";
export declare enum storaeEnum {
    memory = "memory",
    disk = "disk"
}
export declare const fileValidation: {
    image: string[];
};
export declare const cloudFileUpload: ({ validation, storageApproach, maxSizeMB }: {
    validation?: string[];
    storageApproach?: storaeEnum;
    maxSizeMB?: number;
}) => multer.Multer;
//# sourceMappingURL=cloud.multer.d.ts.map