import { DataTypes, Op } from "sequelize";
import sequelize from "../configs/database";
import slugify from "slugify";

// CREATE TABLE Products (
//   ID INT AUTO_INCREMENT PRIMARY KEY,
//   Title VARCHAR(255) NOT NULL,
//   Category_ID INT,
//   Slug VARCHAR(255) NOT NULL,
//   Featured BOOLEAN DEFAULT FALSE,
//   Status ENUM('Active', 'Inactive') DEFAULT 'Active',
//   DiscountPercent INT DEFAULT 0,
//   Description TEXT,
//   ImageLink VARCHAR(255) DEFAULT "",
//   Price DECIMAL(10, 2) NOT NULL,
//    Deleted BOOLEAN DEFAULT FALSE,
//   Product_Sample_Information VARCHAR(255),
//   Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
const autoCalcSlug = (word) =>
    word
    .toLowerCase()
    .trim()
    .replace(/ +/g, '_')
    .replace(/_+/g, '-')
const Product = sequelize.define(
  "Product",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Category_ID: {
      type: DataTypes.INTEGER,
    },
    Slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    Status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    DiscountPercent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Description: {
      type: DataTypes.TEXT,
    },
    ImageLink: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    Product_Sample_Information: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
  },
  {
    tableName: "Products",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
    hooks: {
      beforeValidate: async (product, options) => {
        console.log("Before Validate Hook");
        if (typeof product["Title"] === "string") {
          let slug = autoCalcSlug(product["Title"]);
     
          console.log("Slug:", slug);
          const similarSlugsCount = await Product.count({
            where: { Slug: { [Op.like]: `${slug}%` } },
          });
          if (similarSlugsCount > 0) {
            slug = `${slug}-${similarSlugsCount + 1}`;
          }
          product["Slug"] = slug;
        } else {
          console.error("Title is not a string:", product["Title"]);
        }
      },
    },
  }
);

export default Product;
'ベビー あたまするっと プリント半袖Ｔシャツ'