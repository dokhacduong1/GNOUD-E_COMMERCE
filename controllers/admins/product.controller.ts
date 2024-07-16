import { Request, Response } from "express";
import Categorie from "../../models/categorie.model";
import * as tree from "../../helpers/createTree";
import Product from "../../models/product.model";
import sequelize from "../../configs/database";
import ProductInformation from "../../models/product_information.model";
import SizeSpecification from "../../models/size_specification.model";
import ProductOption from "../../models/product_options.model";
import ProductImage from "../../models/ProductImage.model";
import { findEntitiesQuery } from "../../find-record/entities_query";
const prefix_client = "admins";
export const index = async function (req: Request, res: Response) {
  const status: string = req.query.status?.toString();
  const keyword: string = req.query.keyword?.toString();
  let queryPage: number =
    req.query.page && !isNaN(parseInt(req.query.page.toString()))
      ? parseInt(req.query.page.toString())
      : 1;

  const { entities,objectPagination } = await findEntitiesQuery(
    "products",
    "products_count",
    {
      status,
      keyword,
      page: queryPage,
    },
    "idx_id1.ID, idx_id1.Title, idx_id1.Price,idx_id1.DiscountPercent,idx_id1.Category_ID,idx_id1.Featured, idx_id1.Created_At"
  );

  const productInfosPromises = entities.map(async (item) => {
    const idProduct = item["ID"];
    const productInfo = await ProductOption.findAll({
      where: {
        Product_ID: idProduct,
      },
      attributes: ["ID", "Title", "Color", "List_Options", "Stock"],
      raw: true,
    });

    const productImagesPromises = productInfo.map(async (product) => {
      const idProductOption = product["ID"];
      const productImage = await ProductImage.findAll({
        where: {
          Option_ID: idProductOption,
        },
        raw: true,
      });
      product["ListImages"] = productImage;
    });

    await Promise.all(productImagesPromises);
    item["Options"] = productInfo;
  });

  await Promise.all(productInfosPromises);

  console.log(entities);
  res.render(prefix_client + "/pages/products/index", {
    title: "Management Products",
    products: entities,
    objectPagination: objectPagination,
  });
};

// [GET] /
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
    res.render(prefix_client + "/pages/products/create", {
      title: "Add Product",
      categories: categoriesTree,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//[POST] /
export const postCreate = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    interface RequestProducts {
      title: string;
      category_id: number;
      discount: number;
      featured: boolean;
      options: Array<any>;
      price: number;
      description: string;
      product_information: Array<any>;
      size_specifications: Record<string, any>;
    }

    let {
      title,
      category_id,
      options,
      price,
      description,
      discount,
      featured,
      product_information,
      size_specifications,
    }: RequestProducts = req.body;

    featured = Boolean(Number(featured));
    discount = Number(discount);

    await sequelize.transaction(async (t) => {
      const product = await Product.create(
        {
          Title: title,
          Category_ID: category_id,
          Price: price,
          Description: description,
          DiscountPercent: discount,
          Featured: featured,
        },
        { transaction: t, raw: true }
      );

      const product_id = product.get("ID");

      if (product_information?.length) {
        const productInfoData = product_information.map((item: any) => ({
          Product_ID: product_id,
          Info_Key: item.key || "",
          Info_Value: item.value || "",
        }));

        await ProductInformation.bulkCreate(productInfoData, {
          transaction: t,
        });
      }

      if (Object.keys(size_specifications || {}).length) {
        await SizeSpecification.create(
          {
            Product_ID: product_id,
            TextOption: JSON.stringify(size_specifications),
          },
          { transaction: t }
        );
      }

      for (const option of options) {
        const productOption = await ProductOption.create(
          {
            Product_ID: product_id,
            Title: option.title,
            Color: option.color,
            List_Options: option.listOptions?.length
              ? JSON.stringify(option.listOptions)
              : null,
            Stock: option.stock || null,
          },
          { transaction: t }
        );

        const optionId = productOption.get("ID");

        if (option.listImages?.length) {
          const productImageData = option.listImages.map((image: any) => ({
            Option_ID: optionId,
            ImageURL: image,
          }));

          await ProductImage.bulkCreate(productImageData, { transaction: t });
        }
      }

      res.status(200).json({ message: "Create product success" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
