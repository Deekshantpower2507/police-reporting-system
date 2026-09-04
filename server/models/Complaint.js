const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Complaint = sequelize.define('Complaint', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    complaintId: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    citizenId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    crimeType: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    incidentDate: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    incidentTime: { 
        type: DataTypes.STRING 
    },
    location: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    city: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    state: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    policeStation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    victimInformation: {
        type: DataTypes.JSON
    },
    suspectInformation: {
        type: DataTypes.JSON
    },
    evidence: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    status: { 
        type: DataTypes.ENUM('Submitted', 'Under Review', 'Assigned', 'Under Investigation', 'Resolved', 'Rejected'),
        defaultValue: 'Submitted'
    },
    priority: { 
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'), 
        defaultValue: 'Medium' 
    },
    assignedOfficer: { 
        type: DataTypes.INTEGER,
        allowNull: true
    },
    investigationRemarks: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = Complaint;
