import { Request, Response } from "express";

import {
  extractUniqueValues,
  extractUniqueValuesArray,
} from "../../helpers/uniqueValues.helpers"; // Import các helper để trích xuất giá trị duy nhất
import { LinkImageConverter } from "../../helpers/convertLinkImage"; // Import helper để chuyển đổi đường link ảnh
import {
  IDataSize,

  IProductOption,
  IProductOptionCorlor,
} from "../../interfaces/clients/product.interfaces"; // Import các interface cần thiết
import {
  filterByColor,
  filterBySize,
  getAllChildCategoriesUsingCTE,

  getQueryParams,

} from "../../helpers/categories.helpers"; // Import các hàm trợ giúp liên quan đến category

import {getProductDetails, getProducts, prepareProductData} from "../../helpers/categoriesAndSearch.helpers";

const prefix_client = "clients"; // Đặt prefix cho client


// Hàm xử lý chính của route
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  const idCategory = parseInt(req.params.id.split("GD")[1]); // Lấy ID category từ request params
  const keyword: string = req.query.keyword ? req.query.keyword.toString() : ""; // Lấy keyword từ query
  if (isNaN(idCategory)) {
    res.status(404).json({ message: "Not found" }); // Kiểm tra nếu category không hợp lệ
    return;
  }
  let { products, objectPagination,listIdProduct } = await getProducts(
    idCategory,
    req,
    keyword,
  ); // Lấy danh sách sản phẩm

  const {  breadcrumb, product_options } = await getProductDetails(
    idCategory,
    products
  ); // Lấy chi tiết sản phẩm và category

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
      title: keyword, // Tiêu đề trang
      itemsProducts, // Danh sách sản phẩm
      breadcrumb, // Breadcrumb điều hướng
      categoryShoted,
      listIdProduct,
      sortQuery: getQueryParams(req.query.sort), // Thông tin sắp xếp
      listSizeTexts: sizeFilters, // Bộ lọc size
      listColorTexts: colorFilters, // Bộ lọc màu
      priceMin: parseInt(req.query.priceMin?.toString() || "0"), // Giá tối thiểu
      priceMax: parseInt(req.query.priceMax?.toString() || "0"), // Giá tối đa
      sizes, // Kích thước sản phẩm
      colors, // Màu sắc sản phẩm
      bgClient: "#e1e1e1", // Màu nền
      idSearch:idCategory,
      keyword:keyword,
      objectPagination,
    });
  } catch (error) {
    console.error(error);
    // res.redirect("back");
    res.status(500).json({ message: "Internal server error" }); // Xử lý lỗi server
  }
};
