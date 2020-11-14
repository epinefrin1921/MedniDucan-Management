const express = require('express');
const router = express.Router();
const stores = require('../controllers/stores');

const { validateStore } = require('../middleware');

router.route('/')
    .get(stores.index)
    .post(validateStore, stores.createStore);

router.get("/new", stores.renderNewForm);

router.route('/:id')
    .get(stores.showStore)
    .put(validateStore, stores.updateStore)
    .delete(stores.deleteStore)

router.get("/:id/edit", stores.renderEditForm)

module.exports = router;