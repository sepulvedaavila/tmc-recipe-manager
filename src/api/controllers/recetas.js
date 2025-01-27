const createConnection = require('../db/connection'); // Import the database connection


const getRecipes = async (req, res, next) => {
    let connection;
    const recipesQuery = 'SELECT id_receta,nombre,descripcion,racion,tipo_platillo,fuente FROM Recetas';
    try{
        connection = await createConnection();
        await connection.beginTransaction();
        const [recipeResult] = await connection.execute(recipesQuery);
        await connection.commit();

        res.json({recipeResult});
    } catch (error) {
        console.error('Error al obetener recetas:', error);

        // Rollback the transaction
        await connection.rollback();

        res.json({ message: 'Error al obetener recetas' });
    }
  };

const postRecipe = async (req, res, next) => {

    const receta = req.body;
    //console.log(receta);
    //console.log(res);

    let connection;

    try {

        connection = await createConnection();

        // Start a transaction
        await connection.beginTransaction();

        const [recipeResult] = await connection.execute(
            'INSERT INTO recetas (nombre, fuente, tipo_platillo, racion, descripcion, tags) VALUES (?, ?, ?, ?, ?, ?)',
            [receta.titulo, receta.fuente, receta.tipoPlatillo, receta.racion, receta.descripcion, receta.tags]
        );

        const recipeId = recipeResult.insertId;

        // Insert into the "Ingredientes" table
        const ingredienteInsertQuery =
            'INSERT INTO Ingredientes (id_receta, ingrediente, unidad, por_persona, cantidad_total) VALUES (?, ?, ?, ?, ?)';

        for (const ingrediente of receta.ingredientes) {
            await connection.execute(ingredienteInsertQuery, [
                recipeId,
                ingrediente.ingrediente,
                ingrediente.unidad,
                ingrediente.cantidad / receta.racion, // Calculate "por_persona"
                ingrediente.cantidad,
            ]);
        }

        // Commit the transaction
        await connection.commit();

        res.json({ message: 'Receta guardada con éxito!' });
    } catch (error) {
        console.error('Error al guardar la receta:', error);

        // Rollback the transaction
        await connection.rollback();

        res.json({ message: 'Error al guardar la receta' });
    }

};

module.exports = { 
    postRecipe,
    getRecipes 
};
