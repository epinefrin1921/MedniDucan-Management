const Store = require('../models/stores');
const Product = require('../models/products');
const Sale = require('../models/sales');
const Transfer = require('../models/transfers');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require('../cloudinary/index')

module.exports.index = async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', { stores });
};

module.exports.createStore = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.store.location,
        limit: 1
    }).send()
    const store = new Store(req.body.store);
    store.geometry = geoData.body.features[0].geometry;
    store.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    store.author = req.user._id;
    await store.save();
    req.flash('success', 'Uspjesno napravljena nova radnja!');
    res.redirect(`/stores/${store._id}`);
}
module.exports.renderNewForm = async (req, res) => {
    res.render('stores/new');
};

module.exports.showStore = async (req, res) => {
    const store = await Store.findById(req.params.id).populate('products.productId');
    if (!store) {
        req.flash('error', 'Ne mogu naci tu radnju!');
        return res.redirect('/stores')
    }
    res.render('stores/show', { store });
};
module.exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.store.location,
        limit: 1
    }).send();
    const store = await Store.findByIdAndUpdate(req.params.id, { ...req.body.store });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    store.images.push(...imgs);
    store.geometry = geoData.body.features[0].geometry;
    await store.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await store.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Uspjesno sacuvana radnja!');

    res.redirect(`/stores/${store._id}`);

};
module.exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id);

    for (let img of store.images) {
        await cloudinary.uploader.destroy(img.filename);
    }

    await Store.findByIdAndDelete(req.params.id);
    res.redirect(`/stores`);
};
module.exports.renderEditForm = async (req, res) => {
    const store = await Store.findById(req.params.id);
    if (!store) {
        req.flash('error', 'Ne mogu naci tu radnju!');
        return res.redirect('/stores')
    }
    res.render(`stores/edit`, { store });
};

module.exports.renderAddProductForm = async (req, res) => {
    const products = await Product.find();
    const store = await Store.findById(req.params.id);
    res.render(`stores/newquantity`, { products, store });
};

module.exports.addProduct = async (req, res) => {
    const store = await Store.findById(req.params.id);
    const newProducts = req.body.product;
    const trenutnoRadnja = store.products;

    for (let sproduct in newProducts) {
        let dodan = false;
        for (let item of trenutnoRadnja) {
            if (item.productId.equals(sproduct) && req.body.product[sproduct] > 0) {
                item.quantity = parseInt(item.quantity) + parseInt(req.body.product[sproduct]);
                dodan = true;
            }
        }

        if (req.body.product[sproduct] > 0 && !dodan) {
            const proizvod = {
                productId: sproduct,
                quantity: req.body.product[sproduct]
            }
            trenutnoRadnja.push(proizvod)
        }
    }

    await store.save();
    res.redirect(`/stores/${store._id}`);

}

module.exports.renderSaleForm = async (req, res) => {
    const store = await Store.findById(req.params.id).populate('products.productId');
    if (!store) {
        req.flash('error', 'Ne mogu naci tu radnju!');
        return res.redirect('/stores')
    }
    res.render(`stores/newsale`, { store });
};

module.exports.addSale = async (req, res) => {
    const store = await Store.findById(req.params.id);
    const sale = new Sale();
    sale.napomena = req.body.napomena;
    sale.date = Date.now();
    const trenutnoRadnja = store.products;

    for (let item in req.body.product) {
        if (req.body.product[item] > 0) {
            const produce = await Product.findById(item);
            let saleLine = {
                productId: item,
                quantity: req.body.product[item],
                price: produce.price
            }
            sale.products.push(saleLine);
            for (let prod of trenutnoRadnja) {
                if (prod.productId.equals(item)) {
                    prod.quantity = parseInt(prod.quantity) - parseInt(req.body.product[item]);
                }
            }
        }
    }
    await store.save();
    sale.store = req.params.id;
    sale.author = req.user._id;
    await sale.save();
    res.redirect(`/stores/${req.params.id}/sales`);
}

module.exports.salesIndex = async (req, res) => {
    const store = await Store.findById(req.params.id);
    const sales = await Sale.find({ store: req.params.id }).populate('products.productId').populate('author');
    res.render(`stores/allsales`, { sales, store });
}
module.exports.singleSale = async (req, res) => {
    const store = await Store.findById(req.params.id);
    const sale = await Sale.findById(req.params.saleId).populate('products.productId').populate('author');
    res.render(`stores/sale`, { sale, store });
}


module.exports.renderTransferForm = async (req, res) => {
    const store = await Store.findById(req.params.id).populate('products.productId');
    const allStores = await Store.find({});
    if (!store) {
        req.flash('error', 'Ne mogu naci tu radnju!');
        return res.redirect('/stores')
    }
    res.render(`stores/transfer`, { store, allStores });
};

module.exports.addTransfer = async (req, res) => {
    const storeFrom = await Store.findById(req.params.id);
    const storeTo = await Store.findById(req.body.radnja);
    const transfer = new Transfer();
    transfer.storeFrom = storeFrom._id;
    transfer.storeTo = storeTo._id;
    transfer.napomena = req.body.napomena;
    transfer.date = Date.now();
    const trenutnoRadnjaFrom = storeFrom.products;
    const trenutnoRadnjaTo = storeTo.products;

    for (let item in req.body.product) {
        if (req.body.product[item] > 0) {
            let transferLine = {
                productId: item,
                quantity: req.body.product[item]
            }
            transfer.products.push(transferLine); //dodaje u transfer

            for (let prod of trenutnoRadnjaFrom) {  //izbacuje iz skladista
                if (prod.productId.equals(item)) {
                    prod.quantity = parseInt(prod.quantity) - parseInt(req.body.product[item]);
                }
            }

            let dodan = false;                      //ubacuje u novo skladiste ili radnju
            for (let prod of trenutnoRadnjaTo) {
                if (prod.productId.equals(item) && req.body.product[item] > 0) {
                    prod.quantity = parseInt(prod.quantity) + parseInt(req.body.product[item]);
                    dodan = true;
                }
            }

            if (req.body.product[item] > 0 && !dodan) {
                const proizvod = {
                    productId: item,
                    quantity: req.body.product[item]
                }
                trenutnoRadnjaTo.push(proizvod)
            }
        }
    }
    await storeFrom.save();
    await storeTo.save();
    transfer.author = req.user._id;
    await transfer.save();
    res.redirect(`/stores/${req.params.id}/transfers`);
}

module.exports.transferIndex = async (req, res) => {
    const store = await Store.findById(req.params.id);

    const transfers = await Transfer.find({ storeFrom: req.params.id })
        .populate('products.productId').populate('author').populate('storeTo').populate('storeFrom');

    res.render(`stores/storeTransfers`, { transfers, store });
}
module.exports.singleTransfer = async (req, res) => {
    const store = await Store.findById(req.params.id);
    const transfer = await Transfer.findById(req.params.transferId)
        .populate('products.productId').populate('author').populate('storeTo').populate('storeFrom');
    res.render(`stores/singleTransfer`, { transfer, store });
}