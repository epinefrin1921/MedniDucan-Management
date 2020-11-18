const Sales = require('../models/sales');

module.exports.index = async (req, res) => {
    const sales = await Sales.find({}).populate('author').populate('store').populate('products.productId');
    res.render('sales', { sales });
}
module.exports.indexWeek = async (req, res) => {
    const date = new Date();
    const nextDay = new Date();
    nextDay.setDate(date.getDate() - 7);
    const sales = await Sales.find(
        {
            date: { "$gte": nextDay, "$lt": date }
        }
    ).populate('store').populate('products.productId').populate('author');
    res.render('salesWeek', { sales, date });
}
