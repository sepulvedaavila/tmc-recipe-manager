const express = require('express');
const recetas = require('./api/recetas').default;
const planes = require('./api/planes').default;
//const consts = require('./api/consts').default;

const app = express();
app.use(express.json());

app.post('/api/recetas', recetas);
app.post('/api/planes', planes);
//app.post('/api/consts', consts);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});