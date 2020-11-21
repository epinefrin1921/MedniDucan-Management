const { findById } = require('../models/users');
const User = require('../models/users');
const { renderNewForm } = require('./stores');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash("success", "Uspješno ste sačuvali novog korisnika!");
        res.redirect('/stores');
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect('register')
    }
};
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash("success", "Dobrodošli nazad!");
    const redirectUrl = req.session.returnTo || '/stores';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Prijatno!");
    res.redirect('/');
}

module.exports.renderEditForm = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('users/edit', { user });
}
module.exports.updateUser = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { email: req.body.user.email, username: req.body.user.username });
    const user = await User.findById(req.user._id);
    await user.setPassword(req.body.user.password, async function (err, user) {
        if (err) {
            req.flash('error', "Nismo uspjeli sačuvati podatke!");
        }
        else {
            req.flash('success', "Uspješno spremljeni podaci!");
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
        }
    })
    res.redirect('/stores');
}