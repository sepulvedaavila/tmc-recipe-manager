const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'recipe-plan.cz0oeookwe7h.us-east-2.rds.amazonaws.com',
    user: 'tmc-app-user',
    password: 'hYdmyj-qohcab-1povvu',
    database: 'recipe_plan'
};

var aws_connection = mysql.createConnection({
    host     : "recipe-plan.cz0oeookwe7h.us-east-2.rds.amazonaws.com",
    user     : "tmc-app-user",
    password : "hYdmyj-qohcab-1povvu",
    port     : 3306
  });


const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(aws_connection);
        //const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the database');
        return connection;
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);
        throw err;
    }
};

module.exports = createConnection;