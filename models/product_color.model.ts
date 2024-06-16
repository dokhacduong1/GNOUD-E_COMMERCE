import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// -- Tạo bảng ProductColors
// CREATE TABLE ProductColors (
//     ProductID INT,
//     ColorID INT,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     PRIMARY KEY (ProductID, ColorID),
//     CONSTRAINT FK_Products_ProductColors
//     FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
//     CONSTRAINT FK_Colors_ProductColors
//     FOREIGN KEY (ColorID) REFERENCES Colors(ColorID)
// );

const ProductColor = sequelize.define(
  "ProductColor",
  {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    ColorID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "ProductColors",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  }
);

export default ProductColor;