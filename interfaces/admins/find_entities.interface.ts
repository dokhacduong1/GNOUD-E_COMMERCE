
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