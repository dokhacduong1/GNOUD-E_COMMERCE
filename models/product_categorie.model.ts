import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE ProductCategories (
//     ProductID INT,
//     CategoryID INT,
//     PRIMARY KEY (ProductID, CategoryID),
//     CONSTRAINT FK_Products_ProductCategories
//     FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
//     CONSTRAINT FK_Categories_ProductCategories
//     FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
// );

const ProductCategorie = sequelize.define(
  "ProductCategorie",
  {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "ProductCategories",
    timestamps: false,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  }
);

export default ProductCategorie;
