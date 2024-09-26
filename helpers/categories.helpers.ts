import sequelize from "../configs/database";
import { deleteQuery } from "../find-record/delete_query";
import { CategoryInterface } from "../interfaces/admins/categories.interface";
import {
  IDataSize,
  IProduct,
  IProductOption,
  IProductOptionCorlor,
} from "../interfaces/clients/product.interfaces";
import Categorie from "../models/categorie.model";
import Trash from "../models/trash.model";
const { QueryTypes } = require("sequelize");
const idColothes: number = 6;
const idHouseholdGoods: number = 62;
export async function handleDeleteAll(ids: number[]) {
  for (let id of ids) {
    const record = await Categorie.findByPk(id, {
      raw: true,
    });
    await Trash.create({
      TableName: "categories",
      DataTable: JSON.stringify(record),
    });
    await deleteQuery("categories", id);
  }
}

//Dùng Common Table Expression (CTE) để lấy breadcrumb từ danh mục gốc đến danh mục hiện tại
export const getBreadcrumbUsingCTE = async (categoryId: number) => {
  const query = `
        WITH RECURSIVE CategoryPath (ID, Title, Slug, ParentID) AS (
            SELECT ID, Title, Slug, ParentID
            FROM categories
            WHERE ID = :categoryId
            UNION ALL
            SELECT c.ID, c.Title, c.Slug, c.ParentID
            FROM categories c
            INNER JOIN CategoryPath cp ON cp.ParentID = c.ID
        )
        SELECT * FROM CategoryPath ORDER BY ID ASC;
    `;

  const categories = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements: { categoryId },
  });

  return categories; // Không cần đảo ngược nữa vì đã sắp xếp trong truy vấn SQL
};

export const getAllChildCategoriesUsingCTE = async (
  parentId: number | string
) => {
  const query = `
        WITH RECURSIVE CategoryPath (ID, Title, Slug, ParentID) AS (
            SELECT ID, Title, Slug, ParentID
            FROM categories
            WHERE ParentID = :parentId
            UNION ALL
            SELECT c.ID, c.Title, c.Slug, c.ParentID
            FROM categories c
            INNER JOIN CategoryPath cp ON c.ParentID = cp.ID
        )
        SELECT * FROM CategoryPath ORDER BY ID ASC;
    `;

  const categories = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements: { parentId },
  });

  return categories;
};

export async function getCategories(parentId: number): Promise<any[]> {
  const categories = (await Categorie.findAll({
    where: { ParentID: parentId },
    attributes: ["ID", "Title", "Slug"],
    raw: true,
  })) as unknown as CategoryInterface[];

  return await Promise.all(
    categories.map(async (item) => {
      const children = (await getAllChildCategoriesUsingCTE(
        Number(item.ID)
      )) as unknown as CategoryInterface[];
      return [
        {
          id: item.ID,
          title: item.Title,
          items: children,
        },
      ];
    })
  );
}
export const mergeArrays = (arr1, arr2) => {
  const mergedArray = [...arr1.flat(), ...arr2.flat()];
  const mergedMap = new Map();

  mergedArray.forEach(({ title, id, items }) => {
    if (mergedMap.get(title) === undefined) {
      mergedMap.set(title, { title, id });
    }

    items.forEach(({ ID, Title }) => {
      if (mergedMap.get(Title) === undefined) {
        mergedMap.set(Title, { title: Title, id: ID });
      }
    });
  });

  return Array.from(mergedMap.values());
};
export async function updateCategoriesData() {
  const [dataCategorieClothes, dataCategorieHouseholdGoods] = await Promise.all(
    [getCategories(idColothes), getCategories(idHouseholdGoods)]
  );

  return {
    dataCategorieClothes,
    dataCategorieHouseholdGoods,
    categoryAll: mergeArrays(dataCategorieClothes, dataCategorieHouseholdGoods),
  };
}
// Hàm lọc sản phẩm theo size
export const filterBySize = (
  productOptions: IProductOption[],
  sizeFilters: (string | IDataSize)[]
): number[] =>
  productOptions
    .filter(
      (option) =>
        option.List_Options &&
        sizeFilters.some((size: string & IDataSize) =>
          option.List_Options.includes(size)
        ) // Kiểm tra nếu option có kích thước nào đó khớp với bộ lọc
    )
    .map((option) => option.Product_ID); // Trả về các ID sản phẩm phù hợp

// Hàm lọc sản phẩm theo màu
export const filterByColor = (
  products: IProduct[],
  colorFilters: (string | IProductOptionCorlor)[]
): IProduct[] =>
  colorFilters.length > 0
    ? products.filter((product) => {
        const options = JSON.parse(product.Options?.toString() ?? "[]");
        return options.some((option: string & IProductOptionCorlor) =>
          colorFilters.includes(option.title)
        ); // Kiểm tra nếu sản phẩm có màu khớp với bộ lọc
      })
    : products; // Nếu không có bộ lọc, trả về toàn bộ sản phẩm

// Hàm lấy các tham số truy vấn từ query string
export const getQueryParams = (query: unknown): string[] =>
  Array.isArray(query)
    ? query.map(String)
    : query?.toString()
    ? [query.toString()]
    : [];

// Hàm lấy thông tin sắp xếp từ query
export const getSortQuery = (sortQuery: string): [string, string] => {
  const sortOptions: Record<string, [string, string]> = {
    "price-high": ["Price", "DESC"],
    "price-low": ["Price", "ASC"],
    ranking: ["DiscountPercent", "DESC"],
  };
  return sortOptions[sortQuery] || ["Created_At", "ASC"];
};
