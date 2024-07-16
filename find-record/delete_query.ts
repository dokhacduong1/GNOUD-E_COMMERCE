

import sequelize from "../configs/database";
import { QueryTypes } from "sequelize";

// Hàm xóa entities
export async function deleteQuery(name_table: string, id: number | string) {
  // Kiểm tra đầu vào
  if (!name_table || !id) {
    return {
      success: false,
      message: 'Invalid input parameters',
    };
  }

  try {
    await sequelize.query(
      `
      DELETE FROM ${name_table}
      WHERE ID = :id
      `,
      {
        replacements: { id: id },
        type: QueryTypes.DELETE,
      }
    );

    return {
      success: true,
      message: `Entity with ID ${id} was successfully deleted from ${name_table}`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while deleting the entity',
    };
  }
}