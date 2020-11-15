const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders');
const catchAsync = require('../utils/catchAsync');

const { validateOrder } = require('../middleware');

router.route('/')
    .get(catchAsync(orders.index))
    .post(validateOrder, catchAsync(orders.createOrder))

router.get("/new", orders.renderNewForm);

router.route('/:id')
    .get(catchAsync(orders.showOrder))
    .delete(catchAsync(orders.deleteOrder))

module.exports = router;