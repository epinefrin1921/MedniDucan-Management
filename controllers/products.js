const Product = require('../models/products');
const Store = require('../models/stores');
const { func } = require('joi');

module.exports.index = async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products });
}

module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body.product);
    await product.save();
    res.redirect('/products')
}
module.exports.renderNewForm = async (req, res) => {
    res.render('products/new');
}

module.exports.showProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    const stores = await Store.find().populate('products.productId');

    res.render('products/show', { product, stores });
}

module.exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, { ...req.body.product });
    res.redirect(`/products/${product._id}`);
}
module.exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect(`/products`);
}
module.exports.renderEditForm = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render(`products/edit`, { product });
}
