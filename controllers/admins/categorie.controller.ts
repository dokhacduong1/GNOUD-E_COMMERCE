import { Request, Response } from "express";
import { CategoryInterface } from "../../interfaces/admins/categories.interface";
import Categorie from "../../models/categorie.model";
import * as tree from "../../helpers/createTree";
import { findEntitiesQuery } from "../../find-record/entities_query";
import { deleteQuery } from "../../find-record/delete_query";
import Trash from "../../models/trash.model";
import { handleDeleteAll } from "../../helpers/categories.helpers";
import CategorieCount from "../../models/categorie_count.model";
const prefix_client = "admins";
const backup_redirect = "/admin/categories/management";

// [GET] /admin/categories/add-categorie
export const index = async function (req: Request, res: Response) {
  try {
    //Lấy dữ liệu từ req.query
    const status: string = req.query.status?.toString();
    const keyword: string = req.query.keyword?.toString();
    let queryPage: number =
      req.query.page && !isNaN(parseInt(req.query.page.toString()))
        ? parseInt(req.query.page.toString())
        : 1;
    //Tìm kiếm dữ liệu
    const { entities, objectPagination } = await findEntitiesQuery(
      "categories",
      "categories_count",
      {
        status,
        keyword,
        page: queryPage,
      }
    );
    //Render ra view
    res.render(prefix_client + "/pages/categories/index", {
      title: "Management Categories",
      categories: entities,
      key_select_row: status,
      keyword: keyword,
      objectPagination: objectPagination,
    });
  } catch (error) {
    res.redirect(backup_redirect);
  }
};

// [POST] /admin/categories/create
export const getCreate = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy tất cả các categories
    const categories = await Categorie.findAll({
      where: {
        Deleted: false,
      },
      raw: true,
    });
    //Tạo cây categories
    const categoriesTree = tree.createTree(categories as any);
    //Render ra view
    res.render(prefix_client + "/pages/categories/create", {
      title: "Add Categorie",
      categories: categoriesTree,
    });
  } catch (error) {
    res.redirect(backup_redirect);
  }
};

// [POST] /admin/categories/create
export const postCreate = async function (
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
      slug_title: string;
    }
    //Lấy dữ liệu từ req.body
    const { title, parent_id, description, image,slug_title }: RequestBodyCategory =
      req.body;

    //Kiểm tra dữ liệu
    const category: CategoryInterface = {
      Title: title,
      Description: description,
      Thumbnail: image,
      Slug_Title: slug_title,
    };
    //Nếu parent_id tồn tại thì gán cho category.ParentID
    if (parent_id) {
      category.ParentID = parent_id;
    }
    //Tạo category
    await Categorie.create(category as any);
    req.flash("success", "Create category success");

    res.redirect("/admin/categories/reload-count");
  } catch (error) {
    res.redirect(backup_redirect);
  }
};
export const softDeleteCategory = async function (req: Request, res: Response) {
  try {
    //Lấy id từ req.params
    const id: number = parseInt(req.params.id);
    await Categorie.update(
      {
        Deleted: true,
      },
      {
        where: {
          ID: id,
        },
      }
    );
    //Thông báo xóa thành công
    req.flash("success", "Delete category success");
    //Chuyển hướng người dùng về trang trước
    res.redirect("/admin/categories/reload-count");
  } catch (error) {
    console.log(error);
    res.redirect(backup_redirect);
  }
};
// [GET] /admin/categories/delete-category/:id
export const deleteCategory = async function (req: Request, res: Response) {
  try {
    //Lấy id từ req.params
    const id: number = parseInt(req.params.id);

    await Categorie.destroy({
      where: {
        ID: id,
      },
    });
  
    //Thông báo xóa thành công
    req.flash("success", "Delete category success");
    //Chuyển hướng người dùng về trang trước
    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.redirect(backup_redirect);
  }
};

// [PATCH] /admins/categories/change-status/:status/:id
export const changeStatus = async function (req: Request, res: Response) {
  try {
    //Lấy dữ liệu từ req.params gồm status và id
    const status: string = req.params.status.toString();
    const id: number = parseInt(req.params.id);
    //Update trạng thái của category
    await Categorie.update(
      {
        Status: status,
      },
      {
        where: {
          ID: id,
        },
      }
    );
    //Trả về thông báo cho client
    res.json({
      code: 200,
      message: "Change status success",
      url: "/admin/categories/reload-count",
    });
  } catch (error) {
    res.redirect(backup_redirect);
  }
};

// [PATCH] /admin/categories/change-multi
export const changeMulti = async function (req: Request, res: Response) {
  try {
    // Khai báo enum Type với các giá trị tương ứng
    enum Type {
      DELETE_ALL = "delete-all",
      ACTIVE = "active",
      INACTIVE = "inactive",
    }
    // Lấy danh sách id từ request body, chuyển từ string sang mảng số
    const ids: number[] = req.body.ids
      .split(",")
      .map((id: string) => parseInt(id));
    // Lấy type từ request body
    const type: string = req.body.type;

    // Khởi tạo đối tượng updateFields
    let updateFields = {};
    // Dựa vào giá trị của type để xác định giá trị của updateFields
    switch (type) {
      case Type.ACTIVE:
        updateFields = { Status: "active" };
        break;
      case Type.INACTIVE:
        updateFields = { Status: "inactive" };
        break;
      case Type.DELETE_ALL:
        await handleDeleteAll(ids);
        res.redirect("back");
        return;

      default:
        break;
    }

    // Nếu updateFields có giá trị và ids có phần tử thì thực hiện update
    if (Object.keys(updateFields).length > 0 && ids.length > 0) {
      await Categorie.update(updateFields, {
        where: {
          ID: ids,
        },
      });
    }

    // Chuyển hướng người dùng về trang trước đó

    res.redirect("/admin/categories/reload-count");
  } catch (error) {
    // Nếu có lỗi xảy ra, chuyển hướng người dùng về trang backup
    res.redirect(backup_redirect);
  }
};

// [GET] /admin/categories/edit/:id
export const getEdit = async function (req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const category = await Categorie.findByPk(id, { raw: true });

    //Lấy tất cả các categories
    const categories = await Categorie.findAll({
      where: {
        Deleted: false,
      },
      raw: true,
    });
  
    //Tạo cây categories
    const categoriesTree = tree.createTree(categories as any);
    
    res.render(prefix_client + "/pages/categories/edit", {
      title: "Edit Categorie",
      categories: categoriesTree,
      idMain: id,
      idOrigin: category["ParentID"] || id,
      category: category,
    });
  } catch (error) {}
};

// [PATCH] /admin/categories/edit/:id
export const patchEdit = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id: string = req.params.id;
   
    //Tạo một interface RequestBodyCategory để kiểm tra kiểu dữ liệu của req.body
    interface RequestBodyCategory {
      title: string;
      parent_id: number;
      description: string;
      image: string;
      slug_title: string;
    }
    //Lấy dữ liệu từ req.body
    const { title, parent_id, description, image,slug_title }: RequestBodyCategory =
      req.body;

      
    //Kiểm tra dữ liệu
    const category: CategoryInterface = {
      Title: title,
      Description: description,
      Thumbnail: image,
      Slug_Title: slug_title,
    };
    //Nếu parent_id tồn tại thì gán cho category.ParentID
    if (parent_id && parent_id !== parseInt(id)) {
      category.ParentID = parent_id;
    }
    //Tạo category
    await Categorie.update(category, {
      where: {
        ID: id,
      },
    });

    req.flash("success", "Update category success");
    res.redirect("/admin/categories/reload-count");
  } catch (error) {
    res.redirect(backup_redirect);
  }
};

export const reloadCount = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
   
    const countActive = await Categorie.count({
      where: {
        Status: "active",
      },
    });
    const countInactive = await Categorie.count({
      where: {
        Status: "inactive",
      },
    });
    const countDeleted = await Categorie.count({
      where: {
        Deleted: true,
      },
    });
    await CategorieCount.update(
      {
        count: countActive,
        count_status_inactive: countInactive,
        count_deleted: countDeleted,
      },
      {
        where: {
          ID: 1,
        },
      }
    );
    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
