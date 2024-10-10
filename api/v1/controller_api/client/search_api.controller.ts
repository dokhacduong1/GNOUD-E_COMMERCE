// Import các module cần thiết từ các thư viện
import { Request, Response } from "express"; // Import các interface Request và Response từ thư viện Express
import { IProduct } from "../../../../interfaces/clients/product.interfaces"; // Import interface IProduct từ file product.interfaces
import ProductPreview from "../../../../models/product_preview.model"; // Import model ProductPreview từ file product_preview.model
import { Op } from "sequelize"; // Import các operator từ thư viện Sequelize
import { LinkImageConverter } from "../../../../helpers/convertLinkImage"; // Import hàm LinkImageConverter từ file convertLinkImage
import Categorie from "../../../../models/categorie.model"; // Import model Categorie từ file categorie.model

// Định nghĩa một mảng chứa các thuộc tính của sản phẩm
const PRODUCT_ATTRIBUTES = [
  "Product_ID",
  "Title",
  "Price",
  "Slug",
  "Options",
  "DiscountPercent",
  "Category_ID",
  "Featured",
];

// Định nghĩa interface IProductImage kế thừa từ IProduct và thêm hai thuộc tính image và titleImage
interface IProductImage extends IProduct {
  image?: string;
  titleImage: string;
}

// Định nghĩa hàm getProducts để lấy danh sách sản phẩm dựa trên idCategory và keyword
async function getProducts(
  idCategory: number,
  keyword: string
): Promise<IProductImage[]> {

  // Định nghĩa đối tượng findRecord để lọc sản phẩm
  const findRecord: {
    Category_ID?: number;
    Status: string;
    Deleted: boolean;
    [Op.or]?: any;
  } = {
    Status: "active",
    Deleted: false,
  };

  // Nếu idCategory lớn hơn 0, thêm idCategory vào findRecord
  if (idCategory > 0) {
    findRecord.Category_ID = idCategory;
  }

  // Nếu keyword tồn tại, thêm điều kiện tìm kiếm theo title hoặc slug vào findRecord
  if (keyword) {
    findRecord[Op.or] = [
      { Slug: { [Op.like]: `%${keyword}%` } },
      { Title: { [Op.like]: `%${keyword}%` } },
    ];
  }

  try {
    // Tìm kiếm sản phẩm dựa trên findRecord và trả về các thuộc tính trong PRODUCT_ATTRIBUTES
    const products = (await ProductPreview.findAll({
      where: findRecord,
      attributes: PRODUCT_ATTRIBUTES,
      raw: true,
    })) as unknown as IProduct[];

    // Chuyển đổi Options từ string sang JSON và thêm image và titleImage vào từng sản phẩm
    return products.map((product) => {
      const item = product as IProductImage;
      item.Options = JSON.parse((item.Options as string) || "[]");
      if (item.Options.length > 0) {
        item.image = LinkImageConverter(item.Options[0]["image"], 60, 60);
        item.titleImage = item.Options[0]["title"];
      }
      return item;
    });
  } catch (error) {
    // Nếu có lỗi, in lỗi ra console và trả về mảng rỗng
    console.error(error);
    return [];
  }
}
// Định nghĩa hàm getAllCategory để lấy danh sách các danh mục dựa trên listIdProduct
async function getAllCategory(
  listIdProduct: number[]
): Promise<[{ ID: number; Title: string }]> {
  // Tìm kiếm danh mục dựa trên listIdProduct và trả về ID và Title
  const listCategory = (await Categorie.findAll({
    where: {
      ID: {
        [Op.in]: listIdProduct,
      },
    },
    raw: true,
    attributes: ["ID", "Title"],
  })) as unknown as [{ ID: number; Title: string }];

  return listCategory;
}

export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
 
    if(!req.query.keyword || !req.query.idCategory){
        res.status(200).json({ code: 200, data: []});
        return;
    }

    // Lấy keyword và idCategory từ req.params
  const keyword: string = req.query.keyword.toString() || "";
  const idCategory: number = parseInt(req.query.idCategory.toString()) || 0;
 // Thử lấy dữ liệu từ hàm getProducts và getAllCategory
  try {
    const products = await getProducts(idCategory, keyword);

    const listCategories = await getAllCategory(
        products.map((item) => item.Category_ID)
    );
      
    res.status(200).json({
      code: 200,
      data: {
        products,
        listCategories,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Error" });
  }
};
