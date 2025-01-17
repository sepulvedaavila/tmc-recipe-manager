const createConnection = require('../db/connection'); // Import the database connection


const getPlans = async (req, res, next) => {
    let connection;
    const planesQuery = 'select nombre_plan, fecha_inicio, fecha_fin,cliente from Planes;';
    try{
        connection = await createConnection();
        await connection.beginTransaction();
        const [planResult] = await connection.execute(planesQuery);
        await connection.commit();

        res.json({planResult});
    } catch (error) {
        console.error('Error al obetener planes:', error);

        // Rollback the transaction
        await connection.rollback();

        res.json({ message: 'Error al obetener planes' });
    }
  };

const postPlans = async (req, res, next) => {

    const plan = req.body;
    console.log(plan);
    console.log(res);

    let connection;

    try {

        connection = await createConnection();

        // Start a transaction
        await connection.beginTransaction();

        const planInsertQuery = `
                INSERT INTO Planes (nombre, cliente, fecha_inicio, fecha_fin)
                VALUES (?, ?, ?, ?)
            `;

        const [planResult] = await connection.execute(planInsertQuery,
            [plan.nombre, plan.cliente, plan.fechaInicio, plan.fechaFin]
        );

        const planId = planResult.insertId;

        // Insert into the "Ingredientes" table
        const planRecetasQuery =
            'INSERT INTO Plan_Recetas (id_plan, id_receta) VALUES (?, ?)';

        for (const receta of plan.recetas) {
            await connection.execute(planRecetasQuery, [
                planId,
                receta.recetaId
            ]);
        }

        // Commit the transaction
        await connection.commit();

        res.json({ message: 'Receta guardada con éxito!' });
    } catch (error) {
        console.error('Error al guardar el plan:', error);

        // Rollback the transaction
        await connection.rollback();

        res.json({ message: 'Error al guardar el plan' });
    }

};

module.exports = { 
    postPlans,
    getPlans 
};
