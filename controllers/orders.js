const Order = require('../models/orders');
const Product = require('../models/products');
const Store = require('../models/stores');

module.exports.index = async (req, res) => {
    const orders = await Order.find({}).populate('author').populate('store');
    res.render('orders/index', { orders });
};

module.exports.createOrder = async (req, res) => {
    const order = new Order();
    order.store = req.body.radnja;
    order.napomena = req.body.napomena;
    order.dateMade = Date.now();

    for (let item in req.body.product) {
        if (req.body.product[item] > 0) {
            let orderLine = {
                productId: item,
                quantity: req.body.product[item]
            }
            order.products.push(orderLine);
        }
    };

    order.dateDeliver = req.body.date;
    order.author = req.user._id;

    await order.save();
    res.redirect('/orders')
};
module.exports.renderNewForm = async (req, res) => {
    const stores = await Store.find({});
    const products = await Product.find({});

    res.render('orders/new', { stores, products });
};

module.exports.showOrder = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('author').populate('store').populate('products.productId');
    res.render('orders/show', { order });
};
module.exports.deleteOrder = async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect(`/orders`);
};
