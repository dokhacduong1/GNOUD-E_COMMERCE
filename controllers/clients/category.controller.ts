import { Request, Response } from "express";

import {
  extractUniqueValues,
  extractUniqueValuesArray,
} from "../../helpers/uniqueValues.helpers";
import { LinkImageConverter } from "../../helpers/convertLinkImage";
import {
  IDataSize,

  IProductOption,
  IProductOptionCorlor,
} from "../../interfaces/clients/product.interfaces";
import {
  filterByColor,
  filterBySize,
  getAllChildCategoriesUsingCTE,

  getQueryParams,

} from "../../helpers/categories.helpers";

import {getProductDetails, getProducts, prepareProductData} from "../../helpers/categoriesAndSearch.helpers";

const prefix_client = "clients";

export const index = async function (req: Request, res: Response): Promise<void> {
  const idCategory = parseInt(req.params.id.split("GD")[1]);
  if (isNaN(idCategory)) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  const { products, objectPagination,listIdProduct } = await getProducts(idCategory, req);
  const { nameCategory, breadcrumb, product_options } = await getProductDetails(idCategory, products);

  const sizeFilters = getQueryParams(req.query.sizeTexts);
  const colorFilters = getQueryParams(req.query.colorTexts);

  const filteredProducts = filterByColor(products, colorFilters);
  const productIdsBySize = filterBySize(product_options, sizeFilters);
  const finalProducts = sizeFilters.length > 0
    ? filteredProducts.filter((product) => productIdsBySize.includes(product.Product_ID))
    : filteredProducts;

  const sizes = extractUniqueValues(
    product_options,
    "List_Options",
    (option: IDataSize) => option.size
  );

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
  );

  const itemsProducts = prepareProductData(finalProducts, product_options);
  const parentCategoryId = breadcrumb[1]?.ID || idCategory;
  const categoryShoted = await getAllChildCategoriesUsingCTE(parentCategoryId);

  try {
    res.render(`${prefix_client}/pages/category/index`, {
      idCategory,
      title: nameCategory.Title,
      listIdProduct,
      itemsProducts,
      breadcrumb,
      categoryShoted,
      sortQuery: getQueryParams(req.query.sort),
      listSizeTexts: sizeFilters,
      listColorTexts: colorFilters,
      priceMin: parseInt(req.query.priceMin?.toString() || "0"),
      priceMax: parseInt(req.query.priceMax?.toString() || "0"),
      sizes,
      colors,
      bgClient: "#e1e1e1",
      objectPagination,
    });
  } catch (error) {
    res.redirect("back");
    res.status(500).json({ message: "Internal server error" });
  }
};