import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE ProductOptions (
//   ID INT PRIMARY KEY AUTO_INCREMENT,
//   Product_ID INT,
//   Title VARCHAR(50),
//   Color VARCHAR(255),
//   List_Options Text,
//   Stock INT,
//   FOREIGN KEY (Product_ID) REFERENCES Products(ID),
//   Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
const ProductOption = sequelize.define(
  "ProductOption",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Title:{
      type: DataTypes.STRING(50)
    },
    Product_ID: {
      type: DataTypes.INTEGER,
    },
    Color: {
      type: DataTypes.STRING(255),
    },
    List_Options: {
      type: DataTypes.TEXT,
    }
    ,
    Stock: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "ProductOptions",
    timestamps: false,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
  }
);

export default ProductOption;
