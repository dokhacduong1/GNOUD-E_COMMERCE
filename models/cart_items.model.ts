import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE CartItems (
//     ID INT AUTO_INCREMENT PRIMARY KEY,
//     Cart_ID VARCHAR(255) NOT NULL,
//     Product_ID INT NOT NULL,
//     Product_Option_ID INT NOT NULL, -- ID của ProductOptions
//     SizeProduct VARCHAR(255) NOT NULL, -- Size sản phẩm
//     Quantity INT NOT NULL,
//     Price DECIMAL(10, 2) NOT NULL, -- Giá sản phẩm tại thời điểm thêm vào giỏ
//     FOREIGN KEY (Cart_ID) REFERENCES Cart(Cart_ID) ON DELETE CASCADE,
//     FOREIGN KEY (Product_ID) REFERENCES Products(ID),
//     FOREIGN KEY (Product_Option_ID) REFERENCES ProductOptions(ID)
//   );

const CartItems = sequelize.define(
  "cartitems",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Cart_ID: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Product_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Product_Option_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SizeProduct: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "cartitems",
    timestamps: false,
  }
);

export default CartItems;
