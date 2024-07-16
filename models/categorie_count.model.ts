import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE categories_count (
//     id INT PRIMARY KEY,
//     count INT
// );

const CategorieCount = sequelize.define(
  "categories_count",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    count: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "categories_count",
    timestamps: false,
  }
);

export default CategorieCount;
