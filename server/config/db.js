const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false, // Set to true to see SQL queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`SQLite Database Connected Successfully`);
    } catch (error) {
        console.error(`Error connecting to SQLite: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
