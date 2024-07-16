import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE ProductInformation (
//     ID INT PRIMARY KEY AUTO_INCREMENT,
//     Product_ID INT,
//     Info_Key VARCHAR(255),
//     Info_Value TEXT,
//     FOREIGN KEY (Product_ID) REFERENCES Products(ID)
// );

const ProductInformation = sequelize.define(
  "ProductInformation",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Product_ID: {
      type: DataTypes.INTEGER,
    },
    Info_Key: {
      type: DataTypes.STRING(255),
    },
    Info_Value: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "ProductInformation",
    timestamps: false,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
  }
);

export default ProductInformation;
