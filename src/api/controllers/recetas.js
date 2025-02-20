const createConnection = require('../db/connection'); // Import the database connection
const pool = require('../db/database'); // Path to your database.js



const getRecipes = async (req, res, next) => {
    let connection;

    const { search, sort, dishTypes, minPortions, maxPortions, hasIngredients } = req.query;

    let query = `
    SELECT 
      r.id_receta as recipe_id,
      r.nombre,
      r.fuente,
      r.racion,
      r.tipo_platillo,
      r.descripcion,
      GROUP_CONCAT(...) AS ingredientes 
    FROM recetas r
    LEFT JOIN ingredientes i ON r.id_receta = i.id_receta
  `;

    const whereClauses = [];
    const params = [];

    // Search filter
    if (search) {
        whereClauses.push('(r.nombre LIKE ? OR r.descripcion LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    // Dish type filter
    if (dishTypes) {
        const types = dishTypes.split(',');
        whereClauses.push(`r.tipo_platillo IN (${types.map(() => '?').join(',')})`);
        params.push(...types);
    }

    // Portion range filter
    if (minPortions) {
        whereClauses.push('r.racion >= ?');
        params.push(minPortions);
    }
    if (maxPortions) {
        whereClauses.push('r.racion <= ?');
        params.push(maxPortions);
    }

    // Complete ingredients filter
    if (hasIngredients === 'true') {
        whereClauses.push(`
      i.ingrediente IS NOT NULL AND
      i.unidad IS NOT NULL AND
      i.cantidad_total IS NOT NULL
    `);
    }

    // Build final query
    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ' GROUP BY r.id_receta';

    // Add sorting logic
    const [sortField, sortDirection] = sort.split(':');
    query += ` ORDER BY ${sortField} ${sortDirection}`;

    try {
        // Get connection from pool
        connection = await pool.getConnection();

        const [recipeResult] = await connection.query(`
            SELECT 
                r.id_receta as recipe_id,
                r.nombre,
                r.fuente,
                r.racion,
                r.tipo_platillo,
                r.descripcion,
                GROUP_CONCAT(
                    CONCAT_WS('|||', 
                        i.ingrediente, 
                        i.unidad, 
                        i.por_persona, 
                        i.cantidad_total
                    ) SEPARATOR ';;;'
                ) AS ingredientes 
            FROM recetas r 
            LEFT JOIN ingredientes i ON r.id_receta = i.id_receta 
            GROUP BY r.id_receta
        `);

        // Process ingredients into structured format
        const formattedRecipes = recipeResult.map(recipe => {
            const rawIngredients = recipe.ingredientes ? recipe.ingredientes.split(';;;') : [];

            const ingredients = rawIngredients.map(ing => {
                const [ingrediente, unidad, por_persona, cantidad_total] = ing.split('|||');
                return {
                    ingrediente: ingrediente || 'Unknown',
                    unidad: unidad || '',
                    por_persona: parseFloat(por_persona) || 0,
                    cantidad_total: parseFloat(cantidad_total) || 0
                };
            });

            return {
                ...recipe,
                ingredientes: ingredients
            };
        });

        res.json(formattedRecipes);
    } catch (error) {
        console.error('Error al obtener recetas:', error);
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Error al obtener recetas' });
    } finally {
        if (connection) await connection.release();
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
