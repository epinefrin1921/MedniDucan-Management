const express = require('express');
const router = express.Router();
const products = require('../controllers/products');
const catchAsync = require('../utils/catchAsync');
const { func } = require('joi');

const { validateProduct, isAdmin } = require('../middleware');

router.route('/')
    .get(catchAsync(products.index))
    .post(isAdmin, validateProduct, catchAsync(products.createProduct))

router.get("/new", isAdmin, products.renderNewForm)

router.route('/:id')
    .get(catchAsync(products.showProduct))
    .put(isAdmin, validateProduct, catchAsync(products.updateProduct))
    .delete(isAdmin, catchAsync(products.deleteProduct))

router.get("/:id/edit", isAdmin, (products.renderEditForm))


module.exports = router;