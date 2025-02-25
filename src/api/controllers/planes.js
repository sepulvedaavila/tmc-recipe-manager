const pool = require('../db/database'); // Import the pool instead of createConnection

const getPlans = async (req, res, next) => {
    let connection;
    try {
        // Get connection from pool
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get basic plan information
        const [planResult] = await connection.execute(`
            SELECT 
                p.id_plan,
                p.nombre_plan,
                p.fecha_creacion,
                p.cliente,
                p.racion
            FROM Planes p
            ORDER BY p.fecha_creacion DESC
        `);

        // Get recipes for each plan
        for (let plan of planResult) {
            const [recetasResult] = await connection.execute(`
                SELECT 
                    pr.dia_semana,
                    pr.id_soup,
                    pr.id_main,
                    pr.id_side
                FROM plan_recetas pr
                WHERE pr.id_plan = ?
            `, [plan.id_plan]);

            plan.recetas = recetasResult;
        }

        await connection.commit();
        res.json({ planResult });
    } catch (error) {
        console.error('Error al obtener planes:', error);
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Error al obtener planes' });
    } finally {
        if (connection) {
            connection.release(); // Release connection back to pool
        }
    }
};

const postPlan = async (req, res) => {
    let connection;
    //console.log('Received request:', req);
    try {
        const plan = req.body;
        console.log('Received plan data:', plan);

        // Get connection from pool
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Insert plan
        const [planResult] = await connection.execute(
            'INSERT INTO planes (nombre_plan, cliente, racion) VALUES (?, ?, ?)',
            [plan.nombre_plan, plan.cliente, plan.racion]
        );
        const planId = planResult.insertId;

        // Insert recipes for the plan
        const recipeInsertQuery = 
            'INSERT INTO plan_recetas (id_plan, dia_semana, id_soup, id_main, id_side) VALUES (?, ?, ?, ?, ?)';

        // Insert each day's recipes
        if (Array.isArray(plan.recetas)) {
            await Promise.all(plan.recetas.map(receta => 
                connection.execute(recipeInsertQuery, [
                    planId,
                    receta.dia_semana,
                    receta.id_soup,
                    receta.id_main,
                    receta.id_side
                ])
            ));
        } else {
            throw new Error('Invalid recipes data format');
        }

        await connection.commit();
        res.status(201).json({ 
            message: 'Plan guardado con éxito!',
            planId: planId 
        });

    } catch (error) {
        console.error('Error saving plan:', error);
        if (connection) await connection.rollback();
        
        res.status(500).json({ 
            message: 'Error al guardar el plan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (connection) {
            connection.release(); // Release connection back to pool
        }
    }
};

module.exports = { 
    postPlan,
    getPlans 
};
