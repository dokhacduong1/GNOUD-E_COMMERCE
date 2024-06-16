import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// -- Tạo bảng OrderDetails
// CREATE TABLE OrderDetails (
//     OrderID INT,
//     ProductID INT,
//     Quantity INT NOT NULL CHECK (Quantity > 0),
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     PRIMARY KEY (OrderID, ProductID),
//     CONSTRAINT FK_Orders_OrderDetails
//     FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
//     CONSTRAINT FK_Products_OrderDetails
//     FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
// );

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    OrderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    tableName: "OrderDetails",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  }
);

export default OrderDetail;
