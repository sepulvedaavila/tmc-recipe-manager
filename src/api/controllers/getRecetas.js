const connection = require('../db/connection');

const getRecipes = (callback) => {
  const query = 'SELECT nombre FROM Recetas';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al leer recetas:', err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = { getRecipes };
