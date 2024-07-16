import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE SizeSpecifications (
//     ID INT PRIMARY KEY AUTO_INCREMENT,
//     Product_ID INT,
//     TextOption TEXT,
//     FOREIGN KEY (Product_ID) REFERENCES Products(ID),
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
const SizeSpecification = sequelize.define(
  "SizeSpecification",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Product_ID: {
      type: DataTypes.INTEGER,
    },
    TextOption: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "SizeSpecifications",
    timestamps: false,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
  }
);

export default SizeSpecification;
