// CREATE TABLE `categories_count` (
//     `id` int NOT NULL,
//     `count` int DEFAULT '0',
//     `count_status_inactive` int DEFAULT '0',
//      `count_deleted` int DEFAULT '0',
//     PRIMARY KEY (`id`)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
import { DataTypes } from "sequelize";
import sequelize from "../configs/database";



const ProductCount = sequelize.define(
  "products_count",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    count: {
      type: DataTypes.INTEGER,
    },
    count_status_inactive: {
      type: DataTypes.INTEGER,
       
    },
    count_deleted: {
      type: DataTypes.INTEGER,
       
    },
  },
  {
    tableName: "products_count",
    timestamps: false,
  }
);

export default ProductCount;
