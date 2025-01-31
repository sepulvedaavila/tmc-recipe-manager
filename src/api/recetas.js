import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'tmc-app-user',
    password: 'hYdmyj-qohcab-1povvu',
    database: 'recipe_plan'
};

const validatePorPersona = (cantidad, racion) => {
    if (racion <= 0) {
        throw new Error('Racion must be greater than zero');
    }
    return cantidad / racion;
};

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const receta = req.body;
        console.log('Receta:', receta.titulo);
        try {
            const connection = await mysql.createConnection(dbConfig);

            const [result] = await connection.execute(
                'INSERT INTO recetas (nombre, fuente, tipo_platillo, racion, descripcion, tags) VALUES (?, ?, ?, ?, ?, ?)',
                [receta.titulo, receta.fuente, receta.tipoPlatillo, receta.racion, receta.descripcion, receta.tags]
            );

            const recetaId = result.insertId;

            for (const ingrediente of receta.ingredientes) {
                const por_persona = validatePorPersona(ingrediente.cantidad, receta.racion);
                await connection.execute(
                    'INSERT INTO Ingredientes (id_receta, ingrediente, unidad, por_persona, cantidad_total) VALUES (?, ?, ?, ?, ?)',
                    [recetaId, ingrediente.ingrediente, ingrediente.unidad, por_persona, ingrediente.cantidad]
                );
            }

            await connection.end();

            res.status(200).json({ message: 'Recipe saved successfully!' });
        } catch (error) {
            console.error('Error saving recipe:', error);
            res.status(500).json({ message: 'Error saving recipe' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler; 