const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // This will create a file named database.sqlite in the server root
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
