// CREATE TABLE RefreshTokens (
//     ID INT AUTO_INCREMENT PRIMARY KEY,
//     Token Text NOT NULL,
//     User_ID INT NOT NULL,
//     ExpiresAt TIMESTAMP NOT NULL,
//     Is_Revoked BOOLEAN DEFAULT FALSE,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (User_ID) REFERENCES Users(ID) ON DELETE CASCADE
// );

import sequelize from "../configs/database";
import {DataTypes} from "sequelize";

const RefreshTokens = sequelize.define(
    "SizeSpecification",
    {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        User_ID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ExpiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Is_Revoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "RefreshTokens",
        timestamps: true,
        createdAt: "Created_At",
        updatedAt: "Updated_At",
    }
);

export default RefreshTokens;
