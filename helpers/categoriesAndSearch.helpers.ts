import { Request } from "express";
import { IProduct, IProductOption, IProductOptionCorlor } from "../interfaces/clients/product.interfaces";
import { getAllChildCategoriesUsingCTE, getBreadcrumbUsingCTE, getSortQuery } from "./categories.helpers";
import { CategoryInterface } from "../interfaces/admins/categories.interface";
import { Op } from "sequelize";
import ProductPreview from "../models/product_preview.model";
import { filterQueryPagination } from "./filterQueryPagination.";
import Categorie from "../models/categorie.model";
import ProductOption from "../models/product_options.model";
import { LinkImageConverter } from "./convertLinkImage";

const PRODUCT_ATTRIBUTES = [
  "Product_ID",
  "Title",
  "Price",
  "Slug",
  "Options",
  "DiscountPercent",
  "Featured",
];
const LIMITPRODUCT = 12;

export async function getProducts(
  idCategory: number = null,
  req: Request,
  keyword: string = ""
): Promise<{
  products: IProduct[];
  objectPagination?: {
    currentPage: number;
    limitItem: number;
    skip: number;
    totalPage: number;
  };
  listIdProduct: number[];
}> {
  try {
    const page = parseInt(req.query.page?.toString()) || 1;
    const listIdProduct = req.query.listIdProduct?.toString().split(",").map(Number) || [];

    const categoryIds = idCategory ? (await getAllChildCategoriesUsingCTE(idCategory)) as CategoryInterface[] : [];
    const sortQuery = (!req.query.sort || !req.query.listIdProduct) ? ["Created_At", "ASC"] : getSortQuery(req.query.sort?.toString());

    const listIdConvert = idCategory ? [idCategory, ...categoryIds.map(item => parseInt(String(item.ID)))] : [];

    const findRecord: {
      Status: string;
      Deleted: boolean;
      Category_ID?: number[] | number;
      Product_ID?: number[];
      ID?: { [Op.gt]: number; [Op.lt]: number };
      price?: { [Op.gte]: number; [Op.lte]: number };
      [Op.or]?: any;
    } = {
      Status: "active",
      Deleted: false,
      ...((listIdConvert.length && listIdProduct.length<1) && { Category_ID: listIdConvert }),
      ...(keyword && {
        [Op.or]: [
          { Slug: { [Op.like]: `%${keyword}%` } },
          { Title: { [Op.like]: `%${keyword}%` } },
        ],
      }),
      ...(listIdProduct.length && { Product_ID: listIdProduct }),
    };
    const priceMin = parseInt(req.query.priceMin?.toString() ?? "0");
    const priceMax = parseInt(req.query.priceMax?.toString() ?? "0");

    if (req.query.priceMin && req.query.priceMax && priceMin < priceMax && priceMax > 0) {
      findRecord.price = {
        [Op.gte]: priceMin,
        [Op.lte]: priceMax,
      };
    }


    const findRecordForCount = { ...findRecord };
    delete findRecordForCount.Product_ID;

    const countRecord = await ProductPreview.count({ where: findRecordForCount });
    const objectPagination = filterQueryPagination(countRecord, page, LIMITPRODUCT);



    const products = (await ProductPreview.findAll({
      where: findRecord,
      attributes: PRODUCT_ATTRIBUTES,
      raw: true,
      order: [[sortQuery[0], sortQuery[1]]],
      ...(listIdProduct.length === 0 && {
        limit: objectPagination.limitItem,
        offset: objectPagination.skip,
      }),
    })) as unknown as IProduct[];

    return {
      products,
      objectPagination: objectPagination as {
        currentPage: number;
        limitItem: number;
        skip: number;
        totalPage: number;
      },
      listIdProduct: listIdProduct.length>0 ? listIdProduct : products.map(item => item.Product_ID),
    };
  } catch (error) {
    return {
      products: [],
      objectPagination: {
        currentPage: 1,
        limitItem: 1,
        skip: 1,
        totalPage: 1,
      },
      listIdProduct: [],
    };
  }
}

export async function getProductDetails(
  idCategory: number,
  products: IProduct[]
): Promise<{
  nameCategory: { Title: string };
  breadcrumb: CategoryInterface[];
  product_options: IProductOption[];
}> {
  const [nameCategory, breadcrumb, product_options] = await Promise.all([
    await  Categorie.findOne({
      where: { ID: idCategory },
      attributes: ["Title"],
      raw: true,
    }) as unknown as { Title: string },
    await getBreadcrumbUsingCTE(idCategory) as unknown as CategoryInterface[],
    await ProductOption.findAll({
      where: { Product_ID: products.map(item => item.Product_ID) },
      attributes: ["ID", "Product_ID", "List_Options", "Color", "Title"],
      raw: true,
    }) as unknown as IProductOption[],
  ]);

  return { nameCategory, breadcrumb, product_options };
}

export const prepareProductData = (
  products: IProduct[],
  productOptions: IProductOption[]
): any[] =>
  products.map(product => {
    const options = JSON.parse(product.Options?.toString() ?? "[]");
    const productOption = productOptions.find(option => option.Product_ID === product.Product_ID);

    const listOptions = productOption?.List_Options ?? "[]";

    return {
      id: product.Product_ID,
      title: product.Title,
      listImages: Array.isArray(options)
        ? options.map((option: IProductOptionCorlor) => ({
            title: option.title,
            color: LinkImageConverter(option.color, 37, 37),
            img: LinkImageConverter(option.image, 400, 400),
          }))
        : [],
      slug: product.Slug,
      price: product.Price,
      size: listOptions ? JSON.parse(listOptions.toString() ?? "[]") : [],
    };
  });