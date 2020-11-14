const Store = require('../models/stores');

// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// const { cloudinary } = require('../cloudinary/index')

module.exports.index = async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', { stores });
};

module.exports.createStore = async (req, res) => {
    const store = new Store(req.body.store);
    await store.save();
    res.redirect(`/stores/${store._id}`);
}
module.exports.renderNewForm = async (req, res) => {
    res.render('stores/new');
};

module.exports.showStore = async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render('stores/show', { store });
};
module.exports.updateStore = async (req, res) => {
    const store = await Store.findByIdAndUpdate(req.params.id, { ...req.body.store });
    res.redirect(`/stores/${store._id}`);

};
module.exports.deleteStore = async (req, res) => {
    await Store.findByIdAndDelete(req.params.id);
    res.redirect(`/stores`);
};
module.exports.renderEditForm = async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render(`stores/edit`, { store });
};