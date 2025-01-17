const express = require('express');
const planController  = require('../controllers/planes');

const plansRouter = express.Router();

plansRouter.get('/', planController.getPlans);
plansRouter.post('/', planController.postPlans);

module.exports = plansRouter;
