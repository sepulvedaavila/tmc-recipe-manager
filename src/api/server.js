const express = require('express');
const cors = require('cors');

const recipesRouter = require('./routes/recipes');
const plansRouter = require('./routes/plans');

//const recetas = require('./recetas').default;
//const consts = require('./api/consts').default;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipesRouter);
app.use('/api/plans', plansRouter);

//app.post('/api/recetas', recetas);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});