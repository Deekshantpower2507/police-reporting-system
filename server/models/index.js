const User = require('./User');
const Complaint = require('./Complaint');
const StatusHistory = require('./StatusHistory');
const Notification = require('./Notification');
const Bulletin = require('./Bulletin');

// Relationships

// User & Complaint
User.hasMany(Complaint, { foreignKey: 'citizenId', as: 'complaints' });
Complaint.belongsTo(User, { foreignKey: 'citizenId', as: 'citizen' });

// Officer & Complaint
User.hasMany(Complaint, { foreignKey: 'assignedOfficer', as: 'assignedComplaints' });
Complaint.belongsTo(User, { foreignKey: 'assignedOfficer', as: 'officer' });

// Complaint & StatusHistory
Complaint.hasMany(StatusHistory, { foreignKey: 'complaintId', as: 'history' });
StatusHistory.belongsTo(Complaint, { foreignKey: 'complaintId' });

// User & StatusHistory (who updated it)
User.hasMany(StatusHistory, { foreignKey: 'updatedBy' });
StatusHistory.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

// User & Notification
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Bulletin & User (Creator)
User.hasMany(Bulletin, { foreignKey: 'createdBy' });
Bulletin.belongsTo(User, { as: 'admin', foreignKey: 'createdBy' });

module.exports = {
    User,
    Complaint,
    StatusHistory,
    Notification,
    Bulletin
};
