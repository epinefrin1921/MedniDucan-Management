const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./products');
const { func } = require('joi');

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
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // },
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
    return `<strong><a href="/campgrounds/${this._id}">${this.name}</a><strong>`;
})

module.exports = mongoose.model('Store', storeSchema);
