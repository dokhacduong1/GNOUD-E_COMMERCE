import { DataTypes, Op } from "sequelize";
import sequelize from "../configs/database";
import slugify from "slugify";
// CREATE TABLE Categories (
//   ID INT AUTO_INCREMENT PRIMARY KEY,
//   Title VARCHAR(255) NOT NULL,
//   Slug VARCHAR(255) NOT NULL,
//   ParentID INT,
//  Description TEXT,
//   Deleted BOOLEAN DEFAULT FALSE,
//   Thumbnail VARCHAR(255),
//   Status ENUM('active', 'inactive') DEFAULT 'active',
//   Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

const Categorie = sequelize.define(
  "Categories",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Title: {
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
      defaultValue: null,
    },
    Thumbnail: {
      type: DataTypes.STRING,
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    Description:{
      type: DataTypes.STRING
    },
    Status:{
      type: DataTypes.STRING,
      defaultValue: "active"
    }
  },
  {
    tableName: "Categories",
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
    hooks: {
    
      beforeValidate: async (categorie, options) => {
        if (typeof categorie["Title"] === 'string') {
          let slug = slugify(categorie["Title"], { lower: true });
          const similarSlugsCount = await Categorie.count({
            where: { Slug: { [Op.like]: `${slug}%` } },
          });
          if (similarSlugsCount > 0) {
            slug = `${slug}-${similarSlugsCount + 1}`;
          }
          categorie["Slug"] = slug;
        } else {
          console.error('Title is not a string:', categorie["Title"]);
        }
      },
     
    },
    indexes: [
      {
        unique: true,
        fields: ['Slug']
      }
    ]
  }
);

export default Categorie;
