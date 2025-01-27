const createConnection = require('../db/connection'); // Import the database connection


const getPlans = async (req, res, next) => {
    let connection;
    const planesQuery = 'select nombre_plan, fecha_creacion, cliente, racion from Planes;';
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
    //console.log(res);

    let connection;

    try {

        connection = await createConnection();

        // Start a transaction
        await connection.beginTransaction();

        const planInsertQuery = `
                INSERT INTO Planes (nombre_plan, cliente, fecha_creacion, racion)
                VALUES (?, ?, ?, ?)
            `;
        var datetime = new Date();
        const [planResult] = await connection.execute(planInsertQuery,
            [plan.nombre, plan.cliente, datetime, plan.racion]
        );

        const planId = planResult.insertId;

        // Insert into the "Ingredientes" table
        const planRecetasQuery =
            'INSERT INTO Plan_Recetas (id_plan, id_soup, id_main, id_side, dia_semana) VALUES (?, ?, ?, ?, ?)';

        for (const receta of plan.recetas) {
            dia = Object.keys(receta).find(key => receta[key] === value);
            await connection.execute(planRecetasQuery, [
                planId,
                dia,
                receta.dia.Sopa,
                receta.dia['Plato Fuerte'],
                receta.dia['Guarnicion'],
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
