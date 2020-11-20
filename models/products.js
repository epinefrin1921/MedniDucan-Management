const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Stores = require('./stores');

const productSchema = new Schema({
    name: String,
    price: Number
});

productSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Stores.find({}, function (err, docs) {
            if (err) {
                console.log(err);
            }
            else {
                for (let store of docs) {
                    const id = store._id;
                    Stores.updateOne({ _id: id }, {
                        "$pull": { "products": { "productId": doc._id } }
                    },
                        { safe: true, multi: true }, function (err, obj) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Sacuvano!")
                            }
                        })
                }
            }
        });
    }
})

module.exports = mongoose.model('Product', productSchema);
