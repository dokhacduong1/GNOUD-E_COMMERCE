import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// -- Tạo bảng Orders
// CREATE TABLE Orders (
//     OrderID INT AUTO_INCREMENT PRIMARY KEY,
//     OrderDate DATE NOT NULL,
//     CustomerID INT NOT NULL,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     CONSTRAINT FK_Customers_Orders
//     FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
// );

const Order = sequelize.define(
  "Order",
  {
    OrderID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    OrderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Orders",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  }
);

export default Order;
