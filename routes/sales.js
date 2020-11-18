
const express = require('express');
const router = express.Router();
const sales = require('../controllers/sales');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn } = require('../middleware');


router.route('/')
    .get(isLoggedIn, catchAsync(sales.index));

router.route('/week')
    .get(isLoggedIn, catchAsync(sales.indexWeek))


module.exports = router;