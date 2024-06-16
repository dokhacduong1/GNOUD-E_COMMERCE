import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE Customers (
//   CustomerID INT AUTO_INCREMENT PRIMARY KEY,
//   CustomerName VARCHAR(255) NOT NULL,
//   Contact VARCHAR(255),
//   Address VARCHAR(255),
//   UserID int DEFAULT null,
//   Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

const Customer = sequelize.define(
  "Customer",
  {
    CustomerID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CustomerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Contact: {
      type: DataTypes.STRING,
    },
    Address: {
      type: DataTypes.STRING,
    },
    UserID: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "Customers",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  }
);

export default Customer;
