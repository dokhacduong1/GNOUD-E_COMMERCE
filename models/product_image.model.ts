import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE ProductImages (
//     ImageID INT AUTO_INCREMENT PRIMARY KEY,
//     ProductID INT,
//     ColorID INT,
//     ImageLink VARCHAR(255),
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     CONSTRAINT FK_Products_ProductImages
//     FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
//     CONSTRAINT FK_Colors_ProductImages
//     FOREIGN KEY (ColorID) REFERENCES Colors(ColorID)
// );

const ProductImage = sequelize.define(
  "ProductImage",
  {
    ImageID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ColorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ImageLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ProductImages",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  },
 
);

export default ProductImage;
