import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE ProductImages (
//     ID INT PRIMARY KEY AUTO_INCREMENT,
//     Option_ID INT,
//     ImageURL VARCHAR(255),
//     FOREIGN KEY (Option_ID) REFERENCES ProductOptions(ID)
// );
const ProductImage = sequelize.define(
  "ProductImage",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Option_ID: {
      type: DataTypes.INTEGER,
    },
    ImageURL: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "ProductImages",
    timestamps: false,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
  }
);

export default ProductImage;
