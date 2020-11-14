const express = require('express');
const router = express.Router();
const products = require('../controllers/products');

const { validateProduct } = require('../middleware');


router.route('/')
    .get(products.index)
    .post(validateProduct, products.createProduct)

router.get("/new", products.renderNewForm)

router.route('/:id')
    .get(products.showProduct)
    .put(validateProduct, products.updateProduct)
    .delete(products.deleteProduct)

router.get("/:id/edit", products.renderEditForm)


module.exports = router;