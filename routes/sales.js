const express = require('express');
const router = express.Router();
const sales = require('../controllers/sales');
const catchAsync = require('../utils/catchAsync');


router.route('/')
    .get(catchAsync(sales.index));


module.exports = router;


