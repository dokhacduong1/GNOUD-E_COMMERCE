import { Request, Response, query } from "express";
import ProductPreview from "../../models/product_preview.model"; // Import model ProductPreview
import Categorie from "../../models/categorie.model"; // Import model Categorie
import ProductOption from "../../models/product_options.model"; // Import model ProductOption
import { Op } from "sequelize"; // Import phép toán từ Sequelize
import {
  extractUniqueValues,
  extractUniqueValuesArray,
} from "../../helpers/uniqueValues.helpers"; // Import các helper để trích xuất giá trị duy nhất
import { LinkImageConverter } from "../../helpers/convertLinkImage"; // Import helper để chuyển đổi đường link ảnh
import {
  IDataSize,
  IProduct,
  IProductOption,
  IProductOptionCorlor,
} from "../../interfaces/clients/product.interfaces"; // Import các interface cần thiết
import {
  filterByColor,
  filterBySize,
  getAllChildCategoriesUsingCTE,
  getBreadcrumbUsingCTE,
  getQueryParams,
  getSortQuery,
} from "../../helpers/categories.helpers"; // Import các hàm trợ giúp liên quan đến category
import { CategoryInterface } from "../../interfaces/admins/categories.interface"; // Import interface CategoryInterface
import { filterQueryPagination } from "../../helpers/filterQueryPagination.";

const prefix_client = "clients"; // Đặt prefix cho client

const PRODUCT_ATTRIBUTES = [
  "Product_ID",
  "Title",
  "Price",
  "Slug",
  "Options",
  "DiscountPercent",
  "Featured",
]; // Đặt các thuộc tính cần lấy của sản phẩm

const LIMITPRODUCT = 12; // Đặt giới hạn số sản phẩm

// Hàm lấy sản phẩm dựa trên category và product ID
// Hàm getProducts nhận vào idCategory và request, trả về Promise chứa danh sách sản phẩm và thông tin phân trang
async function getProducts(
  idCategory: number,
  req: Request
): Promise<{
  products: IProduct[];
  objectPagination?: {
    currentPage: number;
    limitItem: number;
    skip: number;
    totalPage: number;
  };
}> {
  // Lấy số trang từ query, nếu không có hoặc không phải số thì mặc định là 1
  const page = parseInt(req.query.page?.toString()) || 1;

  // Lấy danh sách ID của các category con
  const categoryIds = (await getAllChildCategoriesUsingCTE(
    idCategory
  )) as unknown as CategoryInterface[];
  // Lấy thông tin sắp xếp từ query
  const sortQuery = getSortQuery(req.query.sort?.toString());

  // Chuyển đổi danh sách ID category sang dạng number
  const listIdConvert: number[] = [
    idCategory,
    ...categoryIds.map((item: CategoryInterface) => parseInt(String(item.ID))),
  ];

  // Tạo điều kiện tìm kiếm
  const findRecord: {
    Status: string;
    Deleted: boolean;
    Category_ID: number[];
    ID?: { [Op.gt]: number; [Op.lt]: number };
    price?: { [Op.gt]: number; [Op.lt]: number };
  } = {
    Status: "active",
    Deleted: false,
    Category_ID: listIdConvert,
  };

  // Đếm số lượng bản ghi phù hợp với điều kiện tìm kiếm
  const countRecord = await ProductPreview.count({ where: findRecord });
  // Tính toán thông tin phân trang
  const objectPagination = filterQueryPagination(
    countRecord,
    page,
    LIMITPRODUCT
  );

  // Lấy giá trị tối thiểu và tối đa của giá sản phẩm từ query
  const priceMin = parseInt(req.query.priceMin?.toString() ?? "0");
  const priceMax = parseInt(req.query.priceMax?.toString() ?? "0");

  // Nếu giá trị tối thiểu nhỏ hơn giá trị tối đa thì thêm điều kiện tìm kiếm theo giá
  if (
    req.query.priceMin &&
    req.query.priceMax &&
    priceMin < priceMax &&
    priceMax > 0
  ) {
    findRecord.price = {
      [Op.gt]: priceMin,
      [Op.lt]: priceMax,
    };
  }

  // Tìm tất cả sản phẩm phù hợp với điều kiện tìm kiếm
  const products = (await ProductPreview.findAll({
    where: findRecord,
    attributes: PRODUCT_ATTRIBUTES,
    raw: true,
    order: [[sortQuery[0], sortQuery[1]]],
    limit: LIMITPRODUCT,
    offset: objectPagination.skip,
  })) as unknown as IProduct[];

  // Trả về danh sách sản phẩm và thông tin phân trang
  return {
    products,
    objectPagination: objectPagination as {
      currentPage: number;
      limitItem: number;
      skip: number;
      totalPage: number;
    },
  };
}

// Hàm lấy thông tin chi tiết về sản phẩm bao gồm tên category, breadcrumb, và các option sản phẩm
async function getProductDetails(
  idCategory: number,
  products: IProduct[]
): Promise<{
  nameCategory: { Title: string };
  breadcrumb: CategoryInterface[];
  product_options: IProductOption[];
}> {
  const [nameCategory, breadcrumb, product_options] = await Promise.all([
    Categorie.findOne({
      where: { ID: idCategory },
      attributes: ["Title"],
      raw: true,
    }) as unknown as { Title: string }, // Lấy tên category
    getBreadcrumbUsingCTE(idCategory) as unknown as CategoryInterface[], // Lấy breadcrumb
    ProductOption.findAll({
      where: { Product_ID: products.map((item) => item.Product_ID) },
      attributes: ["ID", "Product_ID", "List_Options", "Color", "Title"],
      raw: true,
    }) as unknown as IProductOption[], // Lấy danh sách các options của sản phẩm
  ]);

  return { nameCategory, breadcrumb, product_options }; // Trả về các giá trị cần thiết
}

// Hàm chuẩn bị dữ liệu sản phẩm để render ra giao diện
const prepareProductData = (
  products: IProduct[],
  productOptions: IProductOption[]
): any[] =>
  products.map((product) => {
    const options = JSON.parse(product.Options?.toString() ?? "[]"); // Lấy các tùy chọn sản phẩm
    const productOption = productOptions.find(
      (option) => option.Product_ID === product.Product_ID
    );

    const listOptions = productOption?.List_Options ?? "[]";

    return {
      id: product.Product_ID,
      title: product.Title,
      listImages: Array.isArray(options)
        ? options.map((option: IProductOptionCorlor) => ({
            title: option.title,
            color: LinkImageConverter(option.color, 37, 37),
            img: LinkImageConverter(option.image, 400, 400),
          })) // Tạo danh sách hình ảnh của sản phẩm
        : [],
      slug: product.Slug,
      price: product.Price,
      size: listOptions ? JSON.parse(listOptions.toString() ?? "[]") : [], // Chuẩn bị kích thước sản phẩm
    };
  });

// Hàm xử lý chính của route
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  const idCategory = parseInt(req.params.id.split("GD")[1]); // Lấy ID category từ request params
  if (isNaN(idCategory)) {
    res.status(404).json({ message: "Not found" }); // Kiểm tra nếu category không hợp lệ
    return;
  }
  let { products, objectPagination } = await getProducts(idCategory, req); // Lấy danh sách sản phẩm
  const { nameCategory, breadcrumb, product_options } = await getProductDetails(idCategory,products); // Lấy chi tiết sản phẩm và category
  
  const sizeFilters = getQueryParams(req.query.sizeTexts); // Lấy bộ lọc size từ query
  const colorFilters = getQueryParams(req.query.colorTexts); // Lấy bộ lọc màu từ query


  products = filterByColor(products, colorFilters); // Lọc sản phẩm theo màu

  const productIdsBySize = filterBySize(product_options, sizeFilters); // Lọc sản phẩm theo kích thước
  if (sizeFilters.length > 0) {
    products = products.filter((product) =>
      productIdsBySize.includes(product.Product_ID)
    ); // Áp dụng lọc sản phẩm theo size
  }

  const sizes = extractUniqueValues(
    product_options,
    "List_Options",
    (option: IDataSize) => option.size
  ); // Lấy danh sách kích thước duy nhất

  const colors = extractUniqueValuesArray(
    product_options,
    (option: IProductOption): IProductOptionCorlor[] => [
      {
        id: option.ID,
        title: option.Title,
        color: LinkImageConverter(option.Color, 37, 37),
      },
    ],
    (data) => data.title
  ); // Lấy danh sách màu duy nhất

  const itemsProducts = prepareProductData(products, product_options); // Chuẩn bị dữ liệu sản phẩm để hiển thị
  const parentCategoryId = breadcrumb[1]?.ID || idCategory;
  const categoryShoted = await getAllChildCategoriesUsingCTE(parentCategoryId); // Lấy danh sách category con

  try {
    res.render(`${prefix_client}/pages/category/index`, {
      idCategory: idCategory, // ID category
      title: nameCategory.Title, // Tiêu đề trang
      itemsProducts, // Danh sách sản phẩm
      breadcrumb, // Breadcrumb điều hướng
      categoryShoted,
      sortQuery: getQueryParams(req.query.sort), // Thông tin sắp xếp
      listSizeTexts: sizeFilters, // Bộ lọc size
      listColorTexts: colorFilters, // Bộ lọc màu
      priceMin: parseInt(req.query.priceMin?.toString() || "0"), // Giá tối thiểu
      priceMax: parseInt(req.query.priceMax?.toString() || "0"), // Giá tối đa
      sizes, // Kích thước sản phẩm
      colors, // Màu sắc sản phẩm
      bgClient: "#e1e1e1", // Màu nền
      objectPagination,
    });
  } catch (error) {
    res.redirect("back");
    res.status(500).json({ message: "Internal server error" }); // Xử lý lỗi server
  }
};
