const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: String,
    price: Number
});

module.exports = mongoose.model('Order', orderSchema);