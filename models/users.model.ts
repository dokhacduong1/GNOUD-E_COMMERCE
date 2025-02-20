import {DataTypes} from 'sequelize';
import sequelize from '../configs/database';
import bcrypt from "bcrypt";
import UserProvider from "./user_providers";
// -- Tạo bảng Users
// CREATE TABLE Users (
//     ID INT AUTO_INCREMENT PRIMARY KEY,
//     Username VARCHAR(50) NOT NULL UNIQUE,
//     Email VARCHAR(100) NOT NULL UNIQUE,
//     PasswordHash VARCHAR(255) NOT NULL,
//     FullName VARCHAR(100),
//     Status ENUM('Active', 'Inactive', 'Ban') DEFAULT 'Active',
//     Birthday DATE,
//     Sex ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
//     TypeAccount ENUM('Normal', 'Social') DEFAULT 'Normal',
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
const User = sequelize.define('User', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    FullName: {
        type: DataTypes.STRING(100)
    },
    Status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Ban'),
        defaultValue: 'Active'
    },
    Birthday: {
        type: DataTypes.DATE,
        defaultValue: "1990-01-01"
    },
    Sex:{
        type: DataTypes.ENUM('Male','Female','Other'),
        defaultValue: 'Other'
    },
    Avatar: {
        type: DataTypes.STRING(255),
        defaultValue: 'tos-alisg-i-375lmtcpo0-sg/e121c12adb474c83a39f39adf18d3bba~tplv-375lmtcpo0-image'
    },
    TypeAccount: {
        type: DataTypes.ENUM('Normal', 'Social'),
        defaultValue: 'Normal'
    }
}, {
    tableName: 'Users',
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
    hooks: {
        beforeCreate: async (user: any) => {
            const salt = await bcrypt.genSalt(10);
            user.PasswordHash = await bcrypt.hash(user.PasswordHash, salt);
        },
        beforeUpdate: async (user: any) => {

            if (user.changed('PasswordHash')) {
                const salt = await bcrypt.genSalt(10);
                user.PasswordHash = await bcrypt.hash(user.PasswordHash, salt);
            }
        }
    }
})

export default User;