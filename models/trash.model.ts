import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE trash (
//     ID INT PRIMARY KEY AUTO_INCREMENT,
//     TableName VARCHAR(255),
//     DataTable: TEXT,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

const Trash = sequelize.define(
  "trashs",
 {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DataTable: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "trashs",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
 }
);

export default Trash;
