const { productSchema, storeSchema, orderSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const User = require('./models/users');


module.exports.validateStore = (req, res, next) => {
    const { error } = storeSchema.validate(req.body);
    if (error) {
        console.log(req.body);
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};
module.exports.validateOrder = (req, res, next) => {
    const { error } = orderSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Morate biti prijavljeni!')
        return res.redirect('/login')
    }
    next();
}
module.exports.isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user.isAdmin) {
        req.flash('error', 'Nemate dozvolu da uradite to!');
        return res.redirect(`/stores`);
    }
    next();
}

