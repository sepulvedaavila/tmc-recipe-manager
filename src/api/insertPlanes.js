const connection = require('../db/connection'); // Import the database connection

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const plan = req.body;

        try {
            // Start a transaction
            connection.beginTransaction();

            // Insert into the "Planes" table
            const planInsertQuery = `
                INSERT INTO Planes (nombre, descripcion, fechaInicio, fechaFin)
                VALUES (?, ?, ?, ?)
            `;
            connection.query(planInsertQuery, [plan.nombre, plan.descripcion, plan.fechaInicio, plan.fechaFin], (err, result) => {
                if (err) {
                    connection.rollback();
                    throw err;
                }

                const planId = result.insertId; // Get the ID of the inserted plan

                // Insert into the "plan_recetas" table
                const planRecetasQuery = `
                    INSERT INTO Plan_Recetas (planId, recetaId)
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

                    res.status(200).json({ message: 'Plan saved successfully!' });
                });
            });
        } catch (error) {
            console.error('Error saving plan:', error);
            res.status(500).json({ message: 'Error saving plan' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

module.exports = handler;
