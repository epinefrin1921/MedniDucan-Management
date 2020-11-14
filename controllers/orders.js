const Order = require('../models/orders');

module.exports.index = async (req, res) => {
    const orders = await Order.find({});
    res.render('orders/index', { orders });
};

module.exports.createOrder = async (req, res) => {
    const order = new Order(req.body.order);
    await order.save();
    res.redirect('/orders')
};
module.exports.renderNewForm = async (req, res) => {
    res.render('orders/new');
};

module.exports.showOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.render('orders/show', { order });
};
module.exports.deleteOrder = async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect(`/orders`);
};
