import { Request, Response } from "express";
import { CategoryInterface } from "../../interfaces/admins/categories.interface";
import Categorie from "../../models/categorie.model";
import * as tree from "../../helpers/createTree";
const prefix_client = "admins";
// [GET] /admins/add-categorie
export const addCategorie = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const categories = await Categorie.findAll({
      where:{
        Deleted: false
      },
      raw: true,
    });
  
    const categoriesTree = tree.createTree(categories as any);

    res.render(prefix_client + "/pages/categories/add-categorie", {
      title: "Add Categorie",
      categories: categoriesTree,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// [POST] /admins/add-categorie
export const createCategorie = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Tạo một interface RequestBodyCategory để kiểm tra kiểu dữ liệu của req.body
    interface RequestBodyCategory {
      title: string;
      parent_id: number;
      description: string;
      image: string;
    }
    //Lấy dữ liệu từ req.body
    const { title,parent_id, description, image }: RequestBodyCategory = req.body;
    
    //Kiểm tra dữ liệu
    const category: CategoryInterface = {
      CategoryName: title,
      Description: description,
      Thumbnail: image,
    };
    if(parent_id){
      category.ParentID = parent_id;
    }
    const modelCategory =  await Categorie.create(category as any);
    console.log(modelCategory);

    res.redirect("/admin/categories/add-categorie");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
