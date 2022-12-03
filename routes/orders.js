const express = require('express');

const router = express.Router();

const controller = require('../controllers/controller');

router.get('/orders', controller.getorders);

router.get('/orderdetails/:orderid', controller.getorderdetails);

router.get('/deleteorder/:orderid', controller.deleteorder);

module.exports = router;