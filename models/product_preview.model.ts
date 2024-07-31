// CREATE TABLE ProductPreview (
//     ID INT AUTO_INCREMENT PRIMARY KEY,
//     Product_ID INT NOT NULL,
//     Title VARCHAR(255) NOT NULL,
//     Price DECIMAL(10, 2) NOT NULL,
//     DiscountPercent INT DEFAULT 0,
//     Category_ID INT,
//     Featured BOOLEAN DEFAULT FALSE,
//     Slug VARCHAR(255) NOT NULL,
//     Status ENUM('active', 'inactive') DEFAULT 'active',
//     Options TEXT,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (Product_ID) REFERENCES Products(ID)
// );
import { DataTypes } from "sequelize";
import sequelize from "../configs/database";
const ProductPreview = sequelize.define(
  "ProductPreview",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Product_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    DiscountPercent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Category_ID: {
      type: DataTypes.INTEGER,
    },
    Featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    Status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    Slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Options: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "ProductPreview",
    timestamps: false,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
  }
);

export default ProductPreview;
