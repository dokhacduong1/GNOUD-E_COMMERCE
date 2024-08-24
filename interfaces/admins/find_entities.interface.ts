import { Op } from "sequelize";

export interface FindOptions {
  status?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface findEntities {
  Status?: string;
  Deleted: boolean;
  [Op.or]?: (
    | { Slug: { [Op.like]: string } }
    | { Title: { [Op.like]: string } }
  )[];
}

export interface OptionEntity {
  status?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}
export type CountEntitiesResult = { count: number }[];

export interface ObjectPagination {
  currentPage?: number;
  limitItem?: number;
  skip?: number;
  totalPage?: number;
}

export interface CreateReplacements {
  limit_item: number;
  offset_item: number;
  status: string;
  keyword: string;
}
