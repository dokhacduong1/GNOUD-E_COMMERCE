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
import { handleDeleteAll } from "../../helpers/products.helpers";
import { deleteQuery } from "../../find-record/delete_query";
import ProductPreview from "../../models/product_preview.model";
const prefix_client = "admins";
const backup_redirect = "/admin/products/management-product";
export const index = async function (req: Request, res: Response) {
  // Lấy trạng thái từ query và chuyển thành chuỗi
  const status: string = req.query.status?.toString();
  // Lấy từ khóa từ query và chuyển thành chuỗi
  const keyword: string = req.query.keyword?.toString();
  // Lấy số trang từ query, nếu không có hoặc không phải số thì mặc định là 1
  let queryPage: number =
    req.query.page && !isNaN(parseInt(req.query.page.toString()))
      ? parseInt(req.query.page.toString())
      : 1;

  // Thực hiện truy vấn để lấy danh sách sản phẩm và thông tin phân trang
  const { entities, objectPagination } = await findEntitiesQuery(
    "products",
    "products_count",
    {
      status,
      keyword,
      page: queryPage,
    },
    "idx_id1.ID, idx_id1.Title, idx_id1.Price,idx_id1.DiscountPercent,idx_id1.Category_ID,idx_id1.Featured, idx_id1.Created_At,idx_id1.Status"
  );

  // Lấy danh sách ID của tất cả sản phẩm
  const productIds = entities.map((item) => item["ID"]);

  // Lấy tất cả tùy chọn sản phẩm trong một truy vấn duy nhất
  const productOptions = await ProductOption.findAll({
    where: {
      Product_ID: productIds,
    },
    attributes: ["ID", "Title", "Color", "List_Options", "Stock", "Product_ID"],
    raw: true,
  });

  // Lấy tất cả hình ảnh sản phẩm trong một truy vấn duy nhất
  const productImages = await ProductImage.findAll({
    where: {
      Option_ID: productOptions.map((option) => option["ID"]),
    },
    order: [["ID", "ASC"]],
    raw: true,
  });

  // Gán tùy chọn sản phẩm và hình ảnh vào danh sách sản phẩm
  entities.forEach((entity) => {
    const optionsForProduct = productOptions.filter(
      (option) => option["Product_ID"] === entity["ID"]
    );
    entity["ListItems"] = optionsForProduct.map((option) => {
      const imagesForOption = productImages.filter(
        (image) => image["Option_ID"] === option["ID"]
      );
      const recordNew: {
        ID: number;
        NameColor: string;
        color: string;
        img: string;
        ListOptions?: string;
        Stock?: number;
      } = {
        ID: option["ID"],
        NameColor: option["Title"],
        color: `/images/item/${option["Color"]}.avif?w=14&h=14`,
        img: `/images/item/${imagesForOption[0]["ImageURL"]}.avif?w=80&h=80`,
      };
      if (option["List_Options"]) {
        recordNew.ListOptions = option["List_Options"];
      }
      if (option["Stock"]) {
        recordNew.Stock = option["Stock"];
      }

      return recordNew;
    });
  });

  // Render trang sản phẩm với thông tin sản phẩm và phân trang
  res.render(prefix_client + "/pages/products/index", {
    title: "Management Products",
    key_select_row: status,
    keyword: keyword,
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
      const recordPreview: {
        product_id: string;
        title: string;
        price: number;
        discount: number;
        category_id: number;
        featured: boolean;
        slug: string;
        options: any;
        status: string;
      } = {
        product_id: product.get("ID").toString(),
        title: title,
        price: price,
        discount: discount,
        category_id: category_id,
        featured: featured,
        status: product.get("Status").toString(),
        slug: product.get("Slug").toString(),
        options: [],
      };
      for (const option of options) {
        recordPreview.options.push({
          color: option.color,
          image: option.listImages[0],
        });
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
          for (const image of option.listImages) {
            const productImageData = {
              Option_ID: optionId,
              ImageURL: image,
            };

            await ProductImage.create(productImageData, { transaction: t });
          }
        }
      }
      recordPreview.options = JSON.stringify(recordPreview.options);
      await ProductPreview.create(
        {
          Product_ID: recordPreview.product_id,
          Title: recordPreview.title,
          Price: recordPreview.price,
          DiscountPercent: recordPreview.discount,
          Category_ID: recordPreview.category_id,
          Featured: recordPreview.featured,
          Slug: recordPreview.slug,
          Options: recordPreview.options,
          Status: recordPreview.status,
        },
        { transaction: t }
      );
      res.status(200).json({ message: "Create product success" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// [PATCH] /admins/pruducts/change-status/:status/:id
export const changeStatus = async function (req: Request, res: Response) {
  try {
    //Lấy dữ liệu từ req.params gồm status và id
    const status: string = req.params.status.toString();
    const id: number = parseInt(req.params.id);
    //Update trạng thái của product
    await Product.update(
      {
        Status: status,
      },
      {
        where: {
          ID: id,
        },
      }
    );
    //Update trạng thái của product preview
    await ProductPreview.update(
      {
        Status: status,
      },
      {
        where: {
          Product_ID: id,
        },
      }
    );
    //Trả về thông báo cho client
    res.json({ code: 200, message: "Change status success" });
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
        await ProductPreview.update(
          { Status: "active" },
          { where: { Product_ID: ids } }
        );
        break;
      case Type.INACTIVE:
        updateFields = { Status: "inactive" };
        await ProductPreview.update(
          { Status: "inactive" },
          { where: { Product_ID: ids } }
        );
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
      await Product.update(updateFields, {
        where: {
          ID: ids,
        },
      });
    }

    // Chuyển hướng người dùng về trang trước đó
    res.redirect("back");
  } catch (error) {
    // Nếu có lỗi xảy ra, chuyển hướng người dùng về trang backup
    res.redirect(backup_redirect);
  }
};

// [GET] /admin/products/delete/:id
export const deleteProduct = async function (req: Request, res: Response) {
  try {
    const id: number = parseInt(req.params.id);
    const record = await Product.findByPk(id, { raw: true });

    if (!record) {
      req.flash("error", "Product not found");
      res.redirect("back");
      return;
    }

    const findItemOptions = await ProductOption.findAll({
      where: { Product_ID: id },
      raw: true,
    });

    // Use Promise.all with map instead of forEach for async operations
    await Promise.all(
      findItemOptions.map((item) =>
        ProductImage.destroy({ where: { Option_ID: item["ID"] } })
      )
    );

    // Use Promise.all to perform delete operations in parallel
    await Promise.all([
      ProductOption.destroy({ where: { Product_ID: id } }),
      SizeSpecification.destroy({ where: { Product_ID: id } }),
      ProductInformation.destroy({ where: { Product_ID: id } }),
      ProductPreview.destroy({ where: { Product_ID: id } }),
    ]);

    const deleteResult = await deleteQuery("products", id);

    if (!deleteResult.success) {
      req.flash("error", "Delete category failed");
      res.redirect("back");
      return;
    }

    req.flash("success", "Delete product success");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.redirect(backup_redirect);
  }
};

function convertData(data) {
  const { listTitle, listOptions } = data;

  return listTitle.map((title, index) => {
    const options = listOptions.map((option) => option[index]);
    return [title, ...options];
  });
}

// [GET] /admin/products/edit/:id
export const getEdit = async function (req: Request, res: Response) {
  try {
    const id: number = parseInt(req.params.id);

    const product = await Product.findByPk(id, {
      raw: true,
    });
    //Lấy tất cả các categories
    const categorie = await Categorie.findAll({
      where: {
        Deleted: false,
      },
      raw: true,
    });
    //Lấy tất cả các SizeSpecification của sản phẩm
    const size_product = await SizeSpecification.findOne({
      where: {
        Product_ID: id,
      },
      raw: true,
    });
    let convertDataSize = [];
    if (size_product !== null && size_product["TextOption"] !== null) {
      size_product["TextOption"] = JSON.parse(size_product["TextOption"]);
      convertDataSize = convertData(size_product["TextOption"]);
    }
    //Lấy tất cả các productInfomation của sản phẩm
    const productInfomation = await ProductInformation.findAll({
      where: {
        Product_ID: id,
      },
      raw: true,
    });
    //Lấy tất cả các productOption của sản phẩm
    const productOptions = await ProductOption.findAll({
      where: {
        Product_ID: id,
      },
      raw: true,
    });

    productOptions.forEach((option) => {
      option["List_Options"] = JSON.parse(option["List_Options"]);
    });

    //Lấy tất cả các hình ảnh của sản phẩm
    const productImages = await ProductImage.findAll({
      where: {
        Option_ID: productOptions.map((option) => option["ID"]),
      },
      order: [["ID", "ASC"]],
      raw: true,
    });
    console.log(productImages);
    //Gán hình ảnh vào tùy chọn sản phẩm
    productOptions.forEach((option) => {
      const imagesForOption = productImages.filter(
        (image) => image["Option_ID"] === option["ID"]
      );
      option["ListImages"] = imagesForOption.map((image) => ({
        ID: image["ID"],
        ImageURL: image["ImageURL"],
      }));
    });

    //Tạo cây categories
    const categoriesTree = tree.createTree(categorie as any);
    res.render(prefix_client + "/pages/products/edit", {
      categories: categoriesTree,
      product: product,
      idOrigin: product["Category_ID"],
      size_product: convertDataSize,
      productInfomation: productInfomation,
      productOptions: productOptions,
    });
  } catch (error) {
    console.log(error);
    res.redirect(backup_redirect);
  }
};

// [PATCH] /admin/products/edit/:id
interface RequestBodyCategory {
  title: string;
  category_id: number;
  discount: number;
  featured: boolean;
  options: Array<{
    id: number;
    title?: string;
    color?: string;
    stock?: number;
    listOptions?: Array<any>;
    listImages?: Array<{ id: number; link: string }>;
  }>;
  price: number;
  description: string;
  product_information: Array<{ key: string; value: string }>;
  size_specifications: Record<string, any>;
  list_delete_images: Array<number>;
}

export const patchEdit = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
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
      list_delete_images,
    }: RequestBodyCategory = req.body;

    featured = Boolean(Number(featured));
    discount = Number(discount);

    await sequelize.transaction(async (t) => {
      await Product.update(
        {
          Title: title,
          Category_ID: category_id,
          Price: price,
          Description: description,
          DiscountPercent: discount,
          Featured: featured,
        },
        {
          where: { ID: id },
          transaction: t,
        }
      );

      await Promise.all([
        ProductInformation.destroy({
          where: { Product_ID: id },
          transaction: t,
        }),
        ProductPreview.destroy({
          where: { Product_ID: id },
          transaction: t,
        }),
        SizeSpecification.destroy({
          where: { Product_ID: id },
          transaction: t,
        }),
      ]);

      if (product_information?.length) {
        const productInfoData = product_information.map((item) => ({
          Product_ID: id,
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
            Product_ID: id,
            TextOption: JSON.stringify(size_specifications),
          },
          { transaction: t }
        );
      }

      await Promise.all(
        options.map(async (option) => {
          const objectNew = { Title: option.title };
          if (option.color) {
            objectNew["Color"] = option.color;
          }
          if (option.stock) {
            objectNew["Stock"] = option.stock;
          }
          if (option.listOptions) {
            objectNew["List_Options"] = option.listOptions?.length
              ? JSON.stringify(option.listOptions)
              : null;
          }
          const updateProductOption = ProductOption.update(objectNew, {
            where: { ID: option.id },
            transaction: t,
          });
          const handleImages = Promise.all(
            (option.listImages || []).map((item) => {
              if (item.id && item.link) {
                return ProductImage.update(
                  { ImageURL: item.link },
                  {
                    where: { ID: item.id },
                    transaction: t,
                  }
                );
              }
              if (!item.id && item.link) {
                return ProductImage.create(
                  {
                    Option_ID: option.id,
                    ImageURL: item.link,
                  },
                  { transaction: t }
                );
              }
            })
          );
          return Promise.all([updateProductOption, handleImages]);
        })
      );

      //Edit lại product preview
      const product = await Product.findByPk(id, { raw: true });
      const recordPreview: {
        product_id: string;
        title: string;
        price: number;
        discount: number;
        category_id: number;
        featured: boolean;
        slug: string;
        options: any | [];
        status: string;
      } = {
        product_id: product["ID"],
        title: title,
        price: price,
        discount: discount,
        category_id: category_id,
        featured: featured,
        status: product["Status"],
        slug: product["Slug"],
        options: [],
      };
      const productOptions = await ProductOption.findAll({
        where: { Product_ID: id },
        raw: true,
      });
      const optionsPromises = productOptions.map(async (option) => {
        const imageProduct = await ProductImage.findOne({
          where: { Option_ID: option["ID"] },
          order: [["ID", "ASC"]],
          raw: true,
        });
        return {
          color: option["Color"],
          image: imageProduct["ImageURL"],
        };
      });
    
      recordPreview.options = await Promise.all(optionsPromises);
  
      recordPreview.options = JSON.stringify(recordPreview.options);
      await ProductPreview.create(
        {
          Product_ID: recordPreview.product_id,
          Title: recordPreview.title,
          Price: recordPreview.price,
          DiscountPercent: recordPreview.discount,
          Category_ID: recordPreview.category_id,
          Featured: recordPreview.featured,
          Slug: recordPreview.slug,
          Options: recordPreview.options,
          Status: recordPreview.status,
        },
        { transaction: t }
      );
      if (list_delete_images.length > 0) {
        await Promise.all(
          list_delete_images.map((item) => {
            return ProductImage.destroy({
              where: { ID: item },
              transaction: t,
            });
          })
        );
      }
    });

    res.status(200).json({ message: "Create product success" });
  } catch (error) {
    console.log(error);
    res.redirect(backup_redirect);
  }
};
