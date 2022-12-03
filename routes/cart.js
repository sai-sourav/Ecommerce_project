const express = require('express');

const router = express.Router();

const controller = require('../controllers/controller');

router.get('/cart', controller.getcartproducts);

router.post('/cart', controller.postcartproducts);

router.post('/cart/delete', controller.cartproductdelete);

router.get('/carttoorder', controller.carttoorder);

module.exports = router;