import { DataTypes, Op } from "sequelize";
import sequelize from "../configs/database";
import slugify from "slugify";
// CREATE TABLE Categories (
//   CategoryID INT AUTO_INCREMENT PRIMARY KEY,
//   CategoryName VARCHAR(255) NOT NULL,
//   Slug VARCHAR(255) NOT NULL,
//   ParentID INT,
//   Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

const Categorie = sequelize.define(
  "Categorie",
  {
    CategoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ParentID: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Categories",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
    hooks: {
      beforeValidate: async (categorie, options) => {
        let slug = slugify(categorie["CategoryName"], { lower: true });
        const similarSlugsCount = await Categorie.count({
          where: { Slug: { [Op.like]: `${slug}%` } },
        });
        if (similarSlugsCount > 0) {
          slug = `${slug}-${similarSlugsCount + 1}`;
        }
        categorie["Slug"] = slug;
      },
    },
  }
);

export default Categorie;
