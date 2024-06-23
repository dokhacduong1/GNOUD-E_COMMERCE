import { Request, Response,NextFunction } from "express";

import * as uploadToCloudinary from "../../helpers/upload_to_cloudinary";
export const upload_single = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if(req.file){
        const link : string = await uploadToCloudinary.uploadSingle(req.file.buffer);
        req.body[req.file.fieldname] = link;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
