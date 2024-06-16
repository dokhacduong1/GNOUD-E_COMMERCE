import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// -- Tạo bảng Colors với thêm cột ColorLink
// CREATE TABLE Colors (
//     ColorID INT AUTO_INCREMENT PRIMARY KEY,
//     ColorName VARCHAR(50) NOT NULL,
//     ColorLink VARCHAR(255),
//     Status ENUM('Active', 'Inactive') DEFAULT 'Active',
//     Slug VARCHAR(255) NOT NULL,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

const Color = sequelize.define(
  "Color",
  {
    ColorID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ColorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ColorLink: {
      type: DataTypes.STRING,
    },
    Status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    Slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Colors",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  }
);

export default Color;
