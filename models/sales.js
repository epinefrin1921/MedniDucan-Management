const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
    store: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Store"

    },
    date: {
        type: Date,
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    napomena: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Sales', saleSchema);