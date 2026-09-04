const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bulletin = sequelize.define('Bulletin', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: { 
        type: DataTypes.ENUM('Missing', 'Wanted'),
        allowNull: false
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    image: { 
        type: DataTypes.STRING, // URL to image
        allowNull: true
    },
    contactInfo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Contact Local Police Station or dial 100.'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Resolved'),
        defaultValue: 'Active'
    },
    createdBy: {
        type: DataTypes.INTEGER, // Admin ID
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Bulletin;
