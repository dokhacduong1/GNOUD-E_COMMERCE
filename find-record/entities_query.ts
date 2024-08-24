import {
  CountEntitiesResult,
  CreateReplacements,
  FindOptions,
  ObjectPagination,
  OptionEntity,
} from "../interfaces/admins/find_entities.interface";
import { filterQueryPagination } from "../helpers/filterQueryPagination.";
import sequelize from "../configs/database";
import { QueryTypes } from "sequelize";

// Hàm tạo câu truy vấn SQL
function createQuery(
  name_table: string,
  status?: string,
  keyword?: string,
  selectQuery: string = "*"
): string {
  return `
    SELECT ${selectQuery}
    FROM ${name_table} idx_id1
    JOIN(
        select ID
        from ${name_table}
        where Deleted = false ${status ? `and Status = :status` : ""} ${
    keyword ? `and (Slug like :keyword or Title like :keyword)` : ""
  }
        order by ID
        LIMIT :limit_item offset :offset_item
    )idx_id2 ON idx_id1.ID = idx_id2.ID;
  `;
}

// Hàm tạo đối tượng thay thế cho truy vấn SQL
function createReplacements(
  objectPagination: any,
  status?: string,
  keyword?: string
): CreateReplacements {
  return {
    limit_item: objectPagination.limitItem,
    offset_item: objectPagination.skip,
    status: status,
    keyword: `%${keyword}%`,
  };
}

// Hàm tìm kiếm entities
export async function findEntitiesQuery(
  name_table: string,
  name_table_count: string,
  options: FindOptions,
  selectQuery: string = "*"
) {
  // Lấy các thuộc tính từ options
  let { status, keyword }: OptionEntity = options;

  if (keyword) {
    keyword = keyword.trim();
  }
  const page: number = options.page ?? 1;
  const limit: number = options.limit ?? 8;

  // Đếm số lượng entities
  let countEntities: CountEntitiesResult = await sequelize.query(
    `SELECT ${
      status === "inactive"
        ? "count_status_inactive"
        : status === "active"
        ? "count"
        : "count+count_status_inactive"
    } as count FROM ${name_table_count} where id = :id`,
    {
      replacements: { id: 1 },
      type: QueryTypes.SELECT,
      raw: true,
    }
  );

  // Tính toán thông tin phân trang
  const objectPagination: ObjectPagination = filterQueryPagination(
    countEntities[0].count,
    page,
    limit
  );

  // Tạo truy vấn SQL
  const query: string = createQuery(name_table, status, keyword, selectQuery);

  // Tạo đối tượng thay thế cho truy vấn SQL
  const replacements: CreateReplacements = createReplacements(
    objectPagination,
    status,
    keyword
  );

  // Thực hiện truy vấn SQL
  const entities = await sequelize.query(query, {
    replacements: { ...replacements },
    raw: true,
    type: QueryTypes.SELECT,
  });

  // Trả về entities tìm được và thông tin phân trang
  return { entities, objectPagination };
}
