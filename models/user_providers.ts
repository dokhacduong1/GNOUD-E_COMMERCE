// CREATE TABLE `user_providers` (
//     `ID` int NOT NULL AUTO_INCREMENT,
//     `UserID` int NOT NULL,
//     `Provider` enum('Facebook', 'Google') NOT NULL,
//     `ProviderID` varchar(255) NOT NULL,
//     `Linked_At` timestamp DEFAULT CURRENT_TIMESTAMP,
//     PRIMARY KEY (`ID`),
//     UNIQUE KEY `unique_provider_user` (`UserID`, `Provider`),
//     KEY `idx_provider` (`ProviderID`),
//     CONSTRAINT `fk_user_provider` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

import sequelize from "../configs/database";
import {DataTypes} from "sequelize";
import User from "./users.model";

const UserProvider = sequelize.define(
    "user_providers",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Provider: {
            type: DataTypes.ENUM("Facebook", "Google"),
            allowNull: false,
        },
        ProviderID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "user_providers",
        timestamps: false,
    }
);

export default UserProvider;