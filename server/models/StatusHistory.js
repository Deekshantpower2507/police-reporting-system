const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StatusHistory = sequelize.define('StatusHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    complaintId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    previousStatus: { 
        type: DataTypes.STRING 
    },
    newStatus: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    remarks: { 
        type: DataTypes.TEXT 
    },
    updatedBy: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    }
}, {
    timestamps: true
});

module.exports = StatusHistory;
