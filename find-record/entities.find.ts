
import { Op, FindAndCountOptions } from "sequelize";

import {
  FindOptions,
  findEntities,
} from "../interfaces/admins/find_entities.interface";

import { filterQueryPagination } from "../helpers/filterQueryPagination.";

// Khai báo hàm findEntities với hai tham số: model và options
export async function findEntities(model: any, options: FindOptions) {
  // Destructuring các thuộc tính từ options, nếu không có giá trị sẽ sử dụng giá trị mặc định
  const { status, keyword, page = 1, limit = 8 } = options;

  // Khởi tạo đối tượng find với thuộc tính Deleted là false
  const find: findEntities = {
    Deleted: false,
  };

  // Nếu có status, thêm thuộc tính Status vào đối tượng find
  if (status) {
    find.Status = status;
  }

  // Nếu có keyword, thêm thuộc tính Op.or vào đối tượng find để tìm kiếm theo Slug hoặc Title
  if (keyword) {
    find[Op.or] = [
      { Slug: { [Op.like]: `%${keyword}%` } },
      { Title: { [Op.like]: `%${keyword}%` } },
    ];
  }

  // Đếm số lượng entities phù hợp với điều kiện tìm kiếm
  const countEntities = await model.count({
    where: find as any,
  });

  // Tính toán thông tin phân trang
  const objectPagination = filterQueryPagination(countEntities, page, limit);

  // Khởi tạo đối tượng findOptions để tìm kiếm entities
  const findOptions: FindAndCountOptions = {
    where: find as any,
    limit: objectPagination.limitItem,
    offset: objectPagination.skip,
    raw: true,
  };

  // Tìm kiếm entities phù hợp với điều kiện tìm kiếm và thông tin phân trang
  const entities = await model.findAll(findOptions);

  // Trả về entities tìm được và thông tin phân trang
  return { entities, objectPagination };
}