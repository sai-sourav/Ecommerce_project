const express = require('express');

const router = express.Router();

const controller = require('../controllers/controller');

router.get('/cart', controller.getcartproducts);

router.post('/cart', controller.postcartproducts);

module.exports = router;