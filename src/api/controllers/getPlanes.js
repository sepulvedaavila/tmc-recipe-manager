const createConnection = require('../db/connection'); // Import the database connection

const getPlans = async (callback) => {
  const query = 'SELECT nombre_plan FROM Planes';

  const connection = await createConnection(); // Create a new connection
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al leer los planes:', err);
      //if (connection) await connection.end();
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = { getPlans };
