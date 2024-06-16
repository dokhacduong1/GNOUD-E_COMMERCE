import {DataTypes} from 'sequelize';
import sequelize from '../configs/database';
import bcrypt from "bcrypt";
// -- Tạo bảng Users
// CREATE TABLE Users (
//     UserID INT AUTO_INCREMENT PRIMARY KEY,
//     Username VARCHAR(255) NOT NULL UNIQUE,
//     Password VARCHAR(255) NOT NULL,
//     Address VARCHAR(255),
//     Role ENUM('Admin', 'User') DEFAULT 'User',
//     Status ENUM('Active', 'Inactive','Ban') DEFAULT 'Active',
//     Email VARCHAR(255),
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
const User = sequelize.define('User', {
    UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Address: {
        type: DataTypes.STRING
    },
    Role: {
        type: DataTypes.ENUM('Admin', 'User'),
        defaultValue: 'User'
    },
    Status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Ban'),
        defaultValue: 'Active'
    },
    Email: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Users',
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At", 
    hooks: {
        beforeCreate: async (user: any) => {
            const salt = await bcrypt.genSalt(10);
            user.Password = await bcrypt.hash(user.Password, salt);
        },
        beforeUpdate: async (user: any) => {
            if (user.changed('Password')) {
                const salt = await bcrypt.genSalt(10);
                user.Password = await bcrypt.hash(user.Password, salt);
            }
        }
    }
})
export default User;