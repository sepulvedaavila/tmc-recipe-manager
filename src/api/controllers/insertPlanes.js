const connection = require('../db/connection'); // Import the database connection

const postPlans = (callback) => {
    if (callback.method === 'POST') {
        const plan = callback.body;

        try {
            // Start a transaction
            connection.beginTransaction();

            // Insert into the "Planes" table
            const planInsertQuery = `
                INSERT INTO Planes (nombre, cliente, fecha_inicio, fecha_fin)
                VALUES (?, ?, ?, ?)
            `;
            connection.query(planInsertQuery, [plan.nombre, plan.clienteId, plan.fechaInicio, plan.fechaFin], (err, result) => {
                if (err) {
                    connection.rollback();
                    throw err;
                }

                const planId = result.insertId; // Get the ID of the inserted plan

                // Insert into the "plan_recetas" table
                const planRecetasQuery = `
                    INSERT INTO Plan_Recetas (id_plan, id_receta)
                    VALUES (?, ?)
                `;

                // Use a loop to insert associated recipes
                plan.recetas.forEach((receta) => {
                    connection.query(planRecetasQuery, [planId, receta.recetaId], (err) => {
                        if (err) {
                            connection.rollback();
                            throw err;
                        }
                    });
                });

                // Commit the transaction
                connection.commit((err) => {
                    if (err) {
                        connection.rollback();
                        throw err;
                    }

                    res.status(200).json({ message: 'Plan guardado con éxito!' });
                });
            });
        } catch (error) {
            console.error('Error al guardar plan:', error);
            res.status(500).json({ message: 'Error al guardar plan' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

module.exports = { postPlans };
