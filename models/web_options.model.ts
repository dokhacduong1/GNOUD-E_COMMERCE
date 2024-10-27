import { DataTypes } from "sequelize";
import sequelize from "../configs/database";
// CREATE TABLE WebOptions(
//     ID INT AUTO_INCREMENT PRIMARY KEY,
//     CartMaxItems INT DEFAULT 20,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// )
const WebOptions = sequelize.define(
  "weboptions",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CartMaxItems: {
      type:  DataTypes.INTEGER,
      allowNull: false,
    },
    Created_At: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Updated_At: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "weboptions",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At",
  }
);

export default WebOptions;
