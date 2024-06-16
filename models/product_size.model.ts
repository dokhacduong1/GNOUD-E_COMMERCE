import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE ProductSizes (
//     ProductID INT,
//     SizeID INT,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     PRIMARY KEY (ProductID, SizeID),
//     CONSTRAINT FK_Products_ProductSizes
//     FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
//     CONSTRAINT FK_Sizes_ProductSizes
//     FOREIGN KEY (SizeID) REFERENCES Sizes(SizeID)
// );

const ProductSize = sequelize.define(
  "ProductSize",
  {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    SizeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "ProductSizes",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  }
);

export default ProductSize;
