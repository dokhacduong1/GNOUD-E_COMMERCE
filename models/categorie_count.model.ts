import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE `categories_count` (
//   `id` int NOT NULL,
//   `count` int DEFAULT '0',
//   `count_status_inactive` int DEFAULT '0',
//   `count_deleted` int DEFAULT '0',
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

const CategorieCount = sequelize.define(
  "categories_count",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    count_status_inactive: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    count_deleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "categories_count",
    timestamps: false,
  }
);

export default CategorieCount;
