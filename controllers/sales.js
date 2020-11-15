const Sales = require('../models/sales');

module.exports.index = async (req, res) => {
    const sales = await Sales.find({}).populate('author').populate('store');
    console.log(sales);
    res.render('sales', { sales });
}