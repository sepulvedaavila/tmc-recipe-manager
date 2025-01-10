import mysql from 'mysql2/promise';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const plan = req.body;

        try {
            const connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                'INSERT INTO planes (nombre, descripcion, fechaInicio, fechaFin) VALUES (?, ?, ?, ?)',
                [plan.nombre, plan.descripcion, plan.fechaInicio, plan.fechaFin]
            );

            const planId = result.insertId;

            for (const receta of plan.recetas) {
                await connection.execute(
                    'INSERT INTO plan_recetas (planId, recetaId) VALUES (?, ?)',
                    [planId, receta.recetaId]
                );
            }

            await connection.end();

            res.status(200).json({ message: 'Plan saved successfully!' });
        } catch (error) {
            console.error('Error saving plan:', error);
            res.status(500).json({ message: 'Error saving plan' });
        }
    } else if (req.method === 'GET') {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute('SELECT nombre_plan FROM Planes:');
            await connection.end();

            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching plans:', error);
            res.status(500).json({ message: 'Error fetching plans' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;