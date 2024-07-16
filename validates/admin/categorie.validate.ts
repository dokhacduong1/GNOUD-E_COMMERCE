import { Request, Response, NextFunction } from "express";
import Categorie from "../../models/categorie.model";

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
        req.flash("error", "Title is required");
        res.redirect("back");
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


export const editCategorie = async function (
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
        req.flash("error", "Title is required");
        res.redirect("back");
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

export const changeStatus = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    enum Status {
      ACTIVE = "active",
      INACTIVE = "inactive",
    }

    const status: Status = req.params.status as Status;
    const id: number = parseInt(req.params.id);
    if (!Object.values(Status).includes(status)) {
      req.flash("error", "Invalid status");
      res.redirect("back");
      return;
    }
    if (!id) {
      req.flash("error", "Invalid ID");
      res.redirect("back");
      return;
    }
    const recordCheck = await Categorie.findByPk(id,{
      raw: true,
    });
    if (!recordCheck) {
      req.flash("error", "Record not found");
      res.redirect("back");
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

