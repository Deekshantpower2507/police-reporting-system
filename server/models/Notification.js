const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    message: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    read: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    }
}, {
    timestamps: true
});

module.exports = Notification;
