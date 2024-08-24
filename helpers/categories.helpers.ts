import sequelize from "../configs/database";
import { deleteQuery } from "../find-record/delete_query";
import { CategoryInterface } from "../interfaces/admins/categories.interface";
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

export const getAllChildCategoriesUsingCTE = async (parentId: number) => {
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
    attributes: ["ID", "Title"],
    raw: true,
  })) as unknown as CategoryInterface[];

  return await Promise.all(
    categories.map(async (item) => {
      const children = await getAllChildCategoriesUsingCTE(item.ID);
      return [
        {
          title: item.Title,
          items: children,
        },
      ];
    })
  );
}

export async function updateCategoriesData() {
  const [dataCategorieClothes, dataCategorieHouseholdGoods] = await Promise.all(
    [getCategories(idColothes), getCategories(idHouseholdGoods)]
  );

  return {
    dataCategorieClothes,
    dataCategorieHouseholdGoods,
  };
}
