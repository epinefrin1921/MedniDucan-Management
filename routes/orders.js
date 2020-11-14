const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders');

const { validateOrder } = require('../middleware');

router.route('/')
    .get(orders.index)
    .post(validateOrder, orders.createOrder)

router.get("/new", orders.renderNewForm);

router.route('/:id')
    .get(orders.showOrder)
    .delete(orders.deleteOrder)

module.exports = router;