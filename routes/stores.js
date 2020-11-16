const express = require('express');
const router = express.Router();
const stores = require('../controllers/stores');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

const { validateStore, isAdmin, isLoggedIn } = require('../middleware');

router.route('/')
    .get(catchAsync(stores.index))
    .post(isLoggedIn, isAdmin, upload.array('image'), validateStore, catchAsync(stores.createStore));

router.get("/new", isAdmin, stores.renderNewForm);

router.route('/:id')
    .get(catchAsync(stores.showStore))
    .put(isLoggedIn, isAdmin, upload.array('image'), validateStore, catchAsync(stores.updateStore))
    .delete(isAdmin, catchAsync(stores.deleteStore))

router.get("/:id/edit", isAdmin, stores.renderEditForm)

router.route("/:id/addproducts")
    .get(isAdmin, catchAsync(stores.renderAddProductForm))
    .put(isAdmin, catchAsync(stores.addProduct))



router.route("/:id/sales/new")
    .get(isLoggedIn, catchAsync(stores.renderSaleForm))

router.route("/:id/sales")
    .get(isLoggedIn, catchAsync(stores.salesIndex))
    .put(isLoggedIn, catchAsync(stores.addSale))

router.route("/:id/sales/:saleId")
    .get(isLoggedIn, catchAsync(stores.singleSale))



router.route("/:id/transfers/new")
    .get(isAdmin, isLoggedIn, catchAsync(stores.renderTransferForm))

router.route("/:id/transfers")
    .get(isAdmin, isLoggedIn, catchAsync(stores.transferIndex))
    .put(isAdmin, isLoggedIn, catchAsync(stores.addTransfer))

router.route("/:id/transfers/:transferId")
    .get(isAdmin, isLoggedIn, catchAsync(stores.singleTransfer))



module.exports = router;