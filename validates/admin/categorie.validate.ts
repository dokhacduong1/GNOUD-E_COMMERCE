import { Request, Response, NextFunction } from "express";

export const createCategorie = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    interface RequestBodyCategory {
      title: string;
      parent_id: number;
      description: string;
      image: string;
    }
    //Lấy dữ liệu từ req.body
    const { title, parent_id }: RequestBodyCategory =req.body;

    if(!title) {
        res.status(400).json({message: "Title is required"});
        return;
    }

    if (parent_id) {
      req.body.parent_id = parseInt(req.body.parent_id);
    } else {
      req.body.parent_id = null;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
