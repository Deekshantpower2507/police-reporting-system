require('dotenv').config();
const { sequelize } = require('./config/db');
const { User, Complaint, StatusHistory, Notification } = require('./models');

const importData = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected');
        
        // Force sync will drop tables and recreate them
        await sequelize.sync({ force: true });
        console.log('Database Synced');

        const usersPlain = [
            {
                name: 'System Admin',
                email: 'admin@gov.in',
                phone: '1234567890',
                password: 'password123',
                role: 'admin',
                city: 'Delhi',
                state: 'Delhi'
            },
            {
                name: 'Officer Sharma',
                email: 'sharma@police.gov.in',
                phone: '9876543210',
                password: 'password123',
                role: 'police',
                officerId: 'POL-001',
                department: 'Cyber Crime',
                policeStation: 'Central Police Station',
                city: 'Delhi',
                state: 'Delhi'
            },
            {
                name: 'Rahul Kumar',
                email: 'rahul@example.com',
                phone: '5556667777',
                password: 'password123',
                role: 'citizen',
                address: '123 Main St',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001'
            }
        ];

        // Create uses hooks, so password will be hashed
        await User.bulkCreate(usersPlain, { individualHooks: true });
        
        console.log('Demo Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importData();
