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
import {
  IListImage,
  IListOptionNew,
  IProduct,
  IProductImage,
  IProductInformation,
  IProductOption,
  ISizeSpecification,
  RequestBodyCategory,
  RequestProducts,
  TextOptionTypeString,
} from "../../interfaces/admins/products.interface";
import { CategoryInterface } from "../../interfaces/admins/categories.interface";
import ProductCount from "../../models/product_count.model";
const prefix_client = "admins";
const backup_redirect = "/admin/products/management-product";
export const index = async function (req: Request, res: Response) {
  // Lấy ra các giá trị status, keyword và page từ query của yêu cầu
  const {
    status = "",
    keyword = "",
    page = "1",
  } = req.query as { status: string; keyword: string; page: string };

  // Chuyển đổi page thành số, nếu không phải số thì mặc định là 1
  const queryPage = !isNaN(parseInt(page.toString()))
    ? parseInt(page.toString())
    : 1;

  // Tìm kiếm các sản phẩm và thông tin phân trang dựa trên status, keyword và page
  const { entities, objectPagination } = await findEntitiesQuery(
    "products",
    "products_count",
    { status, keyword, page: queryPage },
    "idx_id1.ID, idx_id1.Title, idx_id1.Price,idx_id1.DiscountPercent,idx_id1.Category_ID,idx_id1.Featured, idx_id1.Created_At,idx_id1.Status"
  );

  // Lấy ra danh sách id của các sản phẩm
  const productIds = entities.map((item) => item["ID"]);

  // Tìm kiếm các tùy chọn của sản phẩm dựa trên danh sách id sản phẩm
  const productOptions = (await ProductOption.findAll({
    where: { Product_ID: productIds },
    attributes: ["ID", "Title", "Color", "List_Options", "Stock", "Product_ID"],
    raw: true,
  })) as unknown as IProductOption[];

  // Tìm kiếm các hình ảnh của tùy chọn sản phẩm dựa trên danh sách id tùy chọn
  const productImages = (await ProductImage.findAll({
    where: { Option_ID: productOptions.map((option) => option["ID"]) },
    order: [["ID", "ASC"]],
    raw: true,
  })) as unknown as IProductImage[];

  // Duyệt qua danh sách sản phẩm
  entities.forEach((entity: IProduct) => {
    // Tạo danh sách các tùy chọn của sản phẩm
    entity.ListItems = productOptions.reduce((acc, option: IProductOption) => {
      // Nếu id sản phẩm của tùy chọn khớp với id của sản phẩm
      if (option.Product_ID === entity.ID) {
        // Lọc ra các hình ảnh của tùy chọn
        const imagesForOption = productImages.filter(
          (image: IProductImage) => image.Option_ID === option.ID
        );
        // Tạo một đối tượng mới chứa thông tin của tùy chọn
        const recordNew: IListOptionNew = {
          ID: option.ID,
          NameColor: option.Title,
          color: `/images/item/${option["Color"]}.avif?w=14&h=14`,
          img: `/images/item/${imagesForOption[0]["ImageURL"]}.avif?w=80&h=80`,
          ListOptions: option.List_Options,
          Stock: option.Stock,
        };
        // Thêm đối tượng mới vào danh sách
        acc.push(recordNew);
      }
      // Trả về danh sách
      return acc;
    }, []);
  });

  // Render trang quản lý sản phẩm với các thông tin tương ứng
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
    // Lấy các thông tin cần thiết từ yêu cầu body
    let {
      title, // Tiêu đề sản phẩm
      category_id, // ID danh mục sản phẩm
      options, // Các tùy chọn của sản phẩm
      price, // Giá sản phẩm
      description, // Mô tả sản phẩm
      discount, // Phần trăm giảm giá
      featured, // Sản phẩm nổi bật (true/false)
      product_information, // Thông tin chi tiết sản phẩm
      size_specifications, // Thông số kích thước sản phẩm
      product_sample_information, // Thông tin mẫu sản phẩm
    }: RequestProducts = req.body;

    // Chuyển đổi giá trị featured và discount thành dạng boolean và số
    featured = Boolean(Number(featured));
    discount = Number(discount);

    // Bắt đầu một giao dịch (transaction) với cơ sở dữ liệu
    await sequelize.transaction(async (t) => {
      // Tạo một bản ghi sản phẩm mới trong bảng Product
      const product = await Product.create(
        {
          Title: title, // Tiêu đề sản phẩm
          Category_ID: category_id, // ID danh mục sản phẩm
          Price: price, // Giá sản phẩm
          Description: description, // Mô tả sản phẩm
          DiscountPercent: discount, // Phần trăm giảm giá
          Featured: featured, // Sản phẩm nổi bật
          Product_Sample_Information: product_sample_information, // Thông tin mẫu sản phẩm
        },
        { transaction: t, raw: true } // Thực hiện trong transaction, trả về dữ liệu thô
      );

      // Lấy ID của sản phẩm vừa tạo
      const product_id = product.get("ID");

      // Nếu có thông tin chi tiết sản phẩm, tiến hành tạo các bản ghi tương ứng trong bảng ProductInformation
      if (product_information?.length) {
        const productInfoData = product_information.map((item: any) => ({
          Product_ID: product_id, // ID sản phẩm
          Info_Key: item.key || "", // Khóa thông tin (key)
          Info_Value: item.value || "", // Giá trị thông tin (value)
        }));

        // Tạo nhiều bản ghi cùng lúc trong bảng ProductInformation
        await ProductInformation.bulkCreate(productInfoData, {
          transaction: t,
        });
      }

      // Nếu có thông số kích thước, tiến hành tạo bản ghi trong bảng SizeSpecification
      if (Object.keys(size_specifications || {}).length) {
        await SizeSpecification.create(
          {
            Product_ID: product_id, // ID sản phẩm
            TextOption: JSON.stringify(size_specifications), // Chuyển đổi thông số kích thước thành chuỗi JSON
          },
          { transaction: t }
        );
      }

      // Tạo bản ghi tóm tắt thông tin sản phẩm (ProductPreview)
      const recordPreview: {
        product_id: string; // ID sản phẩm
        title: string; // Tiêu đề sản phẩm
        price: number; // Giá sản phẩm
        discount: number; // Phần trăm giảm giá
        category_id: number; // ID danh mục sản phẩm
        featured: boolean; // Sản phẩm nổi bật
        slug: string; // Slug của sản phẩm
        options: any; // Các tùy chọn của sản phẩm
        status: string; // Trạng thái sản phẩm
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

      // Duyệt qua từng tùy chọn của sản phẩm và tạo bản ghi tương ứng trong bảng ProductOption
      for (const option of options) {
        recordPreview.options.push({
          title: option.title, // Tiêu đề của tùy chọn
          color: option.color, // Màu của tùy chọn
          image: option.listImages[0], // Hình ảnh đầu tiên trong danh sách hình ảnh của tùy chọn
        });
        const productOption = await ProductOption.create(
          {
            Product_ID: product_id, // ID sản phẩm
            Title: option.title, // Tiêu đề tùy chọn
            Color: option.color, // Màu tùy chọn
            List_Options: option.listOptions?.length
              ? JSON.stringify(option.listOptions) // Chuyển đổi các tùy chọn con thành chuỗi JSON
              : null,
            Stock: option.stock || null, // Số lượng tồn kho (nếu có)
          },
          { transaction: t }
        );

        // Lấy ID của tùy chọn vừa tạo
        const optionId = productOption.get("ID");

        // Nếu có danh sách hình ảnh, tiến hành tạo các bản ghi trong bảng ProductImage
        if (option.listImages?.length) {
          for (const image of option.listImages) {
            const productImageData = {
              Option_ID: optionId, // ID tùy chọn
              ImageURL: image, // URL hình ảnh
            };

            // Tạo bản ghi trong bảng ProductImage
            await ProductImage.create(productImageData, { transaction: t });
          }
        }
      }

      // Chuyển đổi các tùy chọn thành chuỗi JSON
      recordPreview.options = JSON.stringify(recordPreview.options);

      // Tạo bản ghi tóm tắt thông tin sản phẩm (ProductPreview)
      await ProductPreview.create(
        {
          Product_ID: recordPreview.product_id, // ID sản phẩm
          Title: recordPreview.title, // Tiêu đề sản phẩm
          Price: recordPreview.price, // Giá sản phẩm
          DiscountPercent: recordPreview.discount, // Phần trăm giảm giá
          Category_ID: recordPreview.category_id, // ID danh mục sản phẩm
          Featured: recordPreview.featured, // Sản phẩm nổi bật
          Slug: recordPreview.slug, // Slug của sản phẩm
          Options: recordPreview.options, // Các tùy chọn của sản phẩm (dạng JSON)
          Status: recordPreview.status, // Trạng thái sản phẩm
        },
        { transaction: t }
      );

      // Trả về phản hồi thành công
      res.status(200).json({ message: "Create product success" });
    });
  } catch (error) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// [PATCH] /admins/pruducts/change-status/:status/:id
export const changeStatus = async function (
  req: Request,
  res: Response
): Promise<void> {
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
    res.json({ code: 200, message: "Change status success",url:"/admin/products/reload-count" });
  } catch (error) {
    res.redirect(backup_redirect);
  }
};

// [PATCH] /admin/categories/change-multi
export const changeMulti = async function (
  req: Request,
  res: Response
): Promise<void> {
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
    res.redirect("/admin/products/reload-count");
  } catch (error) {
    // Nếu có lỗi xảy ra, chuyển hướng người dùng về trang backup
    res.redirect(backup_redirect);
  }
};
// [GET] /admin/products/soft-delete/:id
export const softDeleteProduct = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Lấy id từ tham số của yêu cầu và chuyển đổi nó thành số
    const id: number = parseInt(req.params.id);
    await Product.update(
      {
        Deleted: true,
      },
      {
        where: {
          ID: id,
        },
      }
    );
    await ProductPreview.update(
      {
        Deleted: true,
      },
      {
        where: {
          Product_ID: id,
        },
      }
    );
    req.flash("success", "Delete product success");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.redirect(backup_redirect);
  }
};

// [GET] /admin/products/delete/:id
export const deleteProduct = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Lấy id từ tham số của yêu cầu và chuyển đổi nó thành số
    const id: number = parseInt(req.params.id);
    // Tìm sản phẩm theo id
    const record = (await Product.findByPk(id, {
      raw: true,
    })) as unknown as IProduct;

    // Nếu không tìm thấy sản phẩm, hiển thị thông báo lỗi và chuyển hướng về trang trước
    if (!record) {
      req.flash("error", "Product not found");
      res.redirect("back");
      return;
    }

    // Tìm tất cả các tùy chọn của sản phẩm theo id
    const findItemOptions = (await ProductOption.findAll({
      where: { Product_ID: id },
      raw: true,
    })) as unknown as IProductOption[];

    // Sử dụng Promise.all với map thay vì forEach để thực hiện các thao tác bất đồng bộ
    // Xóa tất cả hình ảnh của các tùy chọn sản phẩm
    await Promise.all(
      findItemOptions.map((item) =>
        ProductImage.destroy({ where: { Option_ID: item["ID"] } })
      )
    );

    // Sử dụng Promise.all để thực hiện các thao tác xóa song song
    // Xóa tất cả các tùy chọn, thông tin kích thước, thông tin sản phẩm và hình ảnh xem trước của sản phẩm
    await Promise.all([
      ProductOption.destroy({ where: { Product_ID: id } }),
      SizeSpecification.destroy({ where: { Product_ID: id } }),
      ProductInformation.destroy({ where: { Product_ID: id } }),
      ProductPreview.destroy({ where: { Product_ID: id } }),
    ]);

    // Thực hiện truy vấn xóa sản phẩm
    const deleteResult = await deleteQuery("products", id);

    // Nếu xóa không thành công, hiển thị thông báo lỗi và chuyển hướng về trang trước
    if (!deleteResult.success) {
      req.flash("error", "Delete category failed");
      res.redirect("back");
      return;
    }

    // Hiển thị thông báo thành công và chuyển hướng về trang trước
    req.flash("success", "Delete product success");
    res.redirect("back");
  } catch (error) {
    // In lỗi ra console nếu có
    console.log(error);
    // Chuyển hướng đến trang dự phòng nếu có lỗi
    res.redirect(backup_redirect);
  }
};

function convertData(data: TextOptionTypeString) {
  // Lấy ra listTitle và listOptions từ data
  const { listTitle, listOptions } = data;

  // Trả về một mảng mới được tạo từ listTitle
  return listTitle.map((title, index) => {
    // Tạo một mảng options từ listOptions, mỗi phần tử trong mảng này là phần tử thứ index của mỗi phần tử trong listOptions
    const options = listOptions.map((option) => option[index]);
    // Trả về một mảng mới bao gồm title và các phần tử của options
    return [title, ...options];
  });
}

// [GET] /admin/products/edit/:id

export const getEdit = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Lấy id từ tham số của yêu cầu và chuyển đổi nó thành số
    const id: number = parseInt(req.params.id);

    // Thực hiện các truy vấn cơ sở dữ liệu song song và lưu kết quả vào các biến tương ứng
    const [
      product,
      categorie,
      size_product,
      productInfomation,
      productOptions,
    ] = await Promise.all([
      // Tìm sản phẩm theo id
      Product.findByPk(id, { raw: true }) as unknown as IProduct,
      // Tìm tất cả các danh mục chưa bị xóa
      Categorie.findAll({
        where: { Deleted: false },
        raw: true,
      }) as unknown as CategoryInterface[],
      // Tìm thông tin kích thước của sản phẩm theo id
      SizeSpecification.findOne({
        where: { Product_ID: id },
        raw: true,
      }) as unknown as ISizeSpecification,
      // Tìm tất cả thông tin của sản phẩm theo id
      ProductInformation.findAll({
        where: { Product_ID: id },
        raw: true,
      }) as unknown as IProductInformation[],
      // Tìm tất cả các tùy chọn của sản phẩm theo id
      ProductOption.findAll({
        where: { Product_ID: id },
        raw: true,
      }) as unknown as IProductOption[],
    ]);

    // Khởi tạo mảng chứa dữ liệu kích thước đã chuyển đổi
    let convertDataSize = [];

    // Nếu thông tin kích thước và tùy chọn kích thước không null, chuyển đổi dữ liệu kích thước
    if (size_product !== null && size_product.TextOption !== null) {
      size_product.TextOption = JSON.parse(String(size_product.TextOption));
      convertDataSize = convertData(size_product.TextOption);
    }

    // Chuyển đổi dữ liệu tùy chọn của sản phẩm
    const productOptionsWithParsedOptions = productOptions.map(
      (option: IProductOption) => ({
        ...option,
        List_Options: JSON.parse(String(option.List_Options)),
      })
    );

    // Tìm tất cả hình ảnh của các tùy chọn sản phẩm
    const productImages = (await ProductImage.findAll({
      where: {
        Option_ID: productOptionsWithParsedOptions.map(
          (option: IProductOption): number => option.ID
        ),
      },
      order: [["ID", "ASC"]],
      raw: true,
    })) as unknown as IProductImage[];

    // Gán hình ảnh vào tùy chọn sản phẩm
    const productOptionsWithImages = productOptionsWithParsedOptions.map(
      (option: IProductOption): IProductOption => {
        const imagesForOption = productImages.filter(
          (image: IProductImage) => image.Option_ID === option.ID
        );

        return {
          ...option,
          ListImages: imagesForOption.map(
            (image: IProductImage): IListImage => ({
              ID: image.ID,
              ImageURL: image.ImageURL,
            })
          ),
        };
      }
    );

    // Tạo cây danh mục
    const categoriesTree = tree.createTree(categorie as any);

    // Render trang chỉnh sửa sản phẩm với dữ liệu cần thiết
    res.render(prefix_client + "/pages/products/edit", {
      categories: categoriesTree,
      product: product,
      idOrigin: product["Category_ID"],
      size_product: convertDataSize,
      productInfomation: productInfomation,
      productOptions: productOptionsWithImages,
    });
  } catch (error) {
    // In lỗi ra console nếu có
    console.log(error);
    // Chuyển hướng đến trang dự phòng nếu có lỗi
    res.redirect(backup_redirect);
  }
};

// [PATCH] /admin/products/edit/:id

export const patchEdit = async (req: Request, res: Response): Promise<void> => {
  try {
    // Lấy ID sản phẩm từ tham số URL và chuyển thành số nguyên
    const id: number = parseInt(req.params.id);

    // Lấy các thông tin cần thiết từ yêu cầu body
    let {
      title, // Tiêu đề sản phẩm
      category_id, // ID danh mục sản phẩm
      options, // Các tùy chọn của sản phẩm
      price, // Giá sản phẩm
      description, // Mô tả sản phẩm
      discount, // Phần trăm giảm giá
      featured, // Sản phẩm nổi bật (true/false)
      product_information, // Thông tin chi tiết sản phẩm
      size_specifications, // Thông số kích thước sản phẩm
      list_delete_images, // Danh sách các hình ảnh cần xóa
      product_sample_information, // Thông tin mẫu sản phẩm
    }: RequestBodyCategory = req.body;

    // Chuyển đổi giá trị featured và discount thành dạng boolean và số
    featured = Boolean(Number(featured));
    discount = Number(discount);

    // Bắt đầu một giao dịch (transaction) với cơ sở dữ liệu
    await sequelize.transaction(async (t) => {
      // Cập nhật thông tin sản phẩm trong bảng Product
      await Product.update(
        {
          Title: title, // Tiêu đề sản phẩm
          Category_ID: category_id, // ID danh mục sản phẩm
          Price: price, // Giá sản phẩm
          Description: description, // Mô tả sản phẩm
          DiscountPercent: discount, // Phần trăm giảm giá
          Featured: featured, // Sản phẩm nổi bật
          Product_Sample_Information: product_sample_information, // Thông tin mẫu sản phẩm
        },
        {
          where: { ID: id }, // Điều kiện cập nhật theo ID sản phẩm
          transaction: t,
        }
      );

      // Xóa các bản ghi liên quan trong bảng ProductInformation, ProductPreview và SizeSpecification
      await Promise.all([
        ProductInformation.destroy({
          where: { Product_ID: id }, // Điều kiện xóa theo ID sản phẩm
          transaction: t,
        }),
        ProductPreview.destroy({
          where: { Product_ID: id }, // Điều kiện xóa theo ID sản phẩm
          transaction: t,
        }),
        SizeSpecification.destroy({
          where: { Product_ID: id }, // Điều kiện xóa theo ID sản phẩm
          transaction: t,
        }),
      ]);

      // Nếu có thông tin chi tiết sản phẩm, tiến hành tạo các bản ghi tương ứng trong bảng ProductInformation
      if (product_information?.length) {
        const productInfoData = product_information.map((item) => ({
          Product_ID: id, // ID sản phẩm
          Info_Key: item.key || "", // Khóa thông tin (key)
          Info_Value: item.value || "", // Giá trị thông tin (value)
        }));
        await ProductInformation.bulkCreate(productInfoData, {
          transaction: t,
        });
      }

      // Nếu có thông số kích thước, tiến hành tạo bản ghi trong bảng SizeSpecification
      if (Object.keys(size_specifications || {}).length) {
        await SizeSpecification.create(
          {
            Product_ID: id, // ID sản phẩm
            TextOption: JSON.stringify(size_specifications), // Chuyển đổi thông số kích thước thành chuỗi JSON
          },
          { transaction: t }
        );
      }

      // Duyệt qua từng tùy chọn của sản phẩm và cập nhật bản ghi tương ứng trong bảng ProductOption
      await Promise.all(
        options.map(async (option) => {
          const objectNew = { Title: option.title }; // Tạo đối tượng mới chứa tiêu đề tùy chọn

          if (option.color) {
            objectNew["Color"] = option.color; // Cập nhật màu của tùy chọn nếu có
          }
          if (option.stock) {
            objectNew["Stock"] = option.stock; // Cập nhật số lượng tồn kho nếu có
          }
          if (option.listOptions) {
            objectNew["List_Options"] = option.listOptions?.length
              ? JSON.stringify(option.listOptions) // Chuyển đổi các tùy chọn con thành chuỗi JSON nếu có
              : null;
          }

          // Cập nhật thông tin tùy chọn trong bảng ProductOption
          const updateProductOption = ProductOption.update(objectNew, {
            where: { ID: option.id }, // Điều kiện cập nhật theo ID tùy chọn
            transaction: t,
          });

          // Xử lý hình ảnh của tùy chọn sản phẩm
          const handleImages = Promise.all(
            (option.listImages || []).map((item) => {
              if (item.id && item.link) {
                return ProductImage.update(
                  { ImageURL: item.link }, // Cập nhật URL hình ảnh
                  {
                    where: { ID: item.id }, // Điều kiện cập nhật theo ID hình ảnh
                    transaction: t,
                  }
                );
              }
              if (!item.id && item.link) {
                return ProductImage.create(
                  {
                    Option_ID: option.id, // ID tùy chọn
                    ImageURL: item.link, // URL hình ảnh
                  },
                  { transaction: t }
                );
              }
            })
          );

          // Chờ tất cả các thao tác cập nhật và xử lý hình ảnh hoàn thành
          return Promise.all([updateProductOption, handleImages]);
        })
      );

      // Chỉnh sửa lại bản ghi tóm tắt thông tin sản phẩm (ProductPreview)
      const product = await Product.findByPk(id, { raw: true });
      const recordPreview: {
        product_id: string; // ID sản phẩm
        title: string; // Tiêu đề sản phẩm
        price: number; // Giá sản phẩm
        discount: number; // Phần trăm giảm giá
        category_id: number; // ID danh mục sản phẩm
        featured: boolean; // Sản phẩm nổi bật
        slug: string; // Slug của sản phẩm
        options: any | []; // Các tùy chọn của sản phẩm
        status: string; // Trạng thái sản phẩm
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

      // Lấy tất cả các tùy chọn của sản phẩm từ bảng ProductOption
      const productOptions = await ProductOption.findAll({
        where: { Product_ID: id },
        raw: true,
      });

      // Tạo (promises) để lấy hình ảnh đầu tiên của mỗi tùy chọn
      const optionsPromises = productOptions.map(async (option) => {
        const imageProduct = await ProductImage.findOne({
          where: { Option_ID: option["ID"] },
          order: [["ID", "ASC"]], // Lấy hình ảnh đầu tiên (sắp xếp theo ID)
          raw: true,
        });
        return {
          title: option["Title"], // Tiêu đề của tùy chọn
          color: option["Color"], // Màu của tùy chọn
          image: imageProduct["ImageURL"], // URL hình ảnh của tùy chọn
        };
      });

      // Chờ tất cả các lời hứa hoàn thành và gán vào tùy chọn của bản ghi tóm tắt sản phẩm
      recordPreview.options = await Promise.all(optionsPromises);

      // Chuyển đổi các tùy chọn thành chuỗi JSON và tạo bản ghi ProductPreview mới
      recordPreview.options = JSON.stringify(recordPreview.options);
      await ProductPreview.create(
        {
          Product_ID: recordPreview.product_id, // ID sản phẩm
          Title: recordPreview.title, // Tiêu đề sản phẩm
          Price: recordPreview.price, // Giá sản phẩm
          DiscountPercent: recordPreview.discount, // Phần trăm giảm giá
          Category_ID: recordPreview.category_id, // ID danh mục sản phẩm
          Featured: recordPreview.featured, // Sản phẩm nổi bật
          Slug: recordPreview.slug, // Slug của sản phẩm
          Options: recordPreview.options, // Các tùy chọn của sản phẩm (dạng JSON)
          Status: recordPreview.status, // Trạng thái sản phẩm
        },
        { transaction: t }
      );

      // Nếu có danh sách hình ảnh cần xóa, tiến hành xóa chúng trong bảng ProductImage
      if (list_delete_images.length > 0) {
        await Promise.all(
          list_delete_images.map((item) => {
            return ProductImage.destroy({
              where: { ID: item }, // Điều kiện xóa theo ID hình ảnh
              transaction: t,
            });
          })
        );
      }
    });

    // Trả về phản hồi thành công
    res.status(200).json({ message: "Create product success" });
  } catch (error) {
    // Bắt lỗi và chuyển hướng về trang dự phòng
    console.log(error);
    res.redirect(backup_redirect);
  }
};

export const reloadCount = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log(req);
    const productActive = await Product.count({
      where: {
        Status: "active",
      },
    });
    const productInactive = await Product.count({
      where: {
        Status: "inactive",
      },
    });
    const productDeleted = await Product.count({
      where: {
        Deleted: true,
      },
    });
    await ProductCount.update(
      {
        count: productActive,
        count_status_inactive: productInactive,
        count_deleted: productDeleted,
      },
      {
        where: {
          ID: 1,
        },
      }
    );
    res.redirect("/admin/products/management-product");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
