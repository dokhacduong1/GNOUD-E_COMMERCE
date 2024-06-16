import { DataTypes } from "sequelize";
import sequelize from "../configs/database";

// CREATE TABLE Sizes (
//     SizeID INT AUTO_INCREMENT PRIMARY KEY,
//     SizeName VARCHAR(50) NOT NULL,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
// );

const Size = sequelize.define(
  "Size",
  {
    SizeID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    SizeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Sizes",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
  }
);

export default Size;
