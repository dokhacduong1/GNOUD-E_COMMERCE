import { DataTypes, Op } from "sequelize";
import sequelize from "../configs/database";
import slugify from "slugify";

// CREATE TABLE Products (
//   ProductID INT AUTO_INCREMENT PRIMARY KEY,
//   ProductName VARCHAR(255) NOT NULL,
//   Slug VARCHAR(255) NOT NULL,
//   Featured BOOLEAN DEFAULT FALSE,
//   Stock INT DEFAULT 0,
//   Status ENUM('Active', 'Inactive') DEFAULT 'Active',
//   DiscountPercent INT DEFAULT 0,
//   Description TEXT,
//   ImageLink VARCHAR(255),
//   Price DECIMAL(10, 2) NOT NULL,
//   Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

const Product = sequelize.define(
  "Product",
  {
    ProductID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ProductName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    Stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    DiscountPercent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Description: {
      type: DataTypes.TEXT,
    },
    ImageLink: {
      type: DataTypes.STRING,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "Products",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
    hooks: {
      beforeValidate: async (product, options) => {
        let slug = slugify(product["ProductName"], { lower: true });
        const similarSlugsCount = await Product.count({
          where: { Slug: { [Op.like]: `${slug}%` } },
        });
        if (similarSlugsCount > 0) {
          slug = `${slug}-${similarSlugsCount + 1}`;
        }
        product["Slug"] = slug;
      },
    },
  }
);

export default Product;
