import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE Cart (
//     ID INT AUTO_INCREMENT PRIMARY KEY,
//     Cart_ID VARCHAR(255) NOT NULL,
//     User_ID INT, -- Có thể NULL nếu không liên kết với người dùng đã đăng nhập
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//   );

const Cart = sequelize.define(
  "cart",
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
    User_ID: {
      type: DataTypes.INTEGER,
    },
    Created_At: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Updated_At: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "cart",
    timestamps: false,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
  }
);

export default Cart;
