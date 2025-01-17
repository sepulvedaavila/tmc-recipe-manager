const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'tmc-app-user',
    password: 'hYdmyj-qohcab-1povvu',
    database: 'recipe_plan'
};

const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the database');
        return connection;
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);
        throw err;
    }
};

module.exports = createConnection;