const mongoose = require('mongoose');
const { transferIndex } = require('../controllers/stores');
const Schema = mongoose.Schema;
const Sales = require('./sales');

const Transfer = require('./transfers');

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const opts = { toJSON: { virtuals: true } };

const storeSchema = new Schema({
    name: String,
    location: String,
    storeType: {
        type: String,
        enum: ['warehouse', 'store'],
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
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
    images: [ImageSchema]
}, opts);

storeSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/stores/${this._id}">${this.name}</a><strong>`;
})

storeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Sales.deleteMany({
            store: doc._id
        });
        await Transfer.deleteMany({
            storeFrom: doc._id
        });
    }
})

module.exports = mongoose.model('Store', storeSchema);
