import {DataTypes} from 'sequelize';
import sequelize from '../configs/database';
import bcrypt from "bcrypt";

// CREATE TABLE DeliveryAddress (
//     ID INT AUTO_INCREMENT PRIMARY KEY,
//     User_ID INT NOT NULL,
//     FullName VARCHAR(100),
//     PhoneNumber VARCHAR(15),
//     City VARCHAR(50),
//     District VARCHAR(50),
//     Ward VARCHAR(50),
//     Address TEXT,
//     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (User_ID) REFERENCES Users(ID) ON DELETE CASCADE
// );
const DeliveryAddress = sequelize.define('DeliveryAddress', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    User_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    FullName: {
        type: DataTypes.STRING(100)
    },
    PhoneNumber: {
        type: DataTypes.STRING(15)
    },
    City: {
        type: DataTypes.STRING(50)
    },
    District: {
        type: DataTypes.STRING(50)
    },
    Ward: {
        type: DataTypes.STRING(50)
    },
    Address: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'DeliveryAddress',
    timestamps: true,
    createdAt: "Created_At",
    updatedAt: "Updated_At"
})

export default DeliveryAddress;