const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn, isAdmin } = require('../middleware');

router.route('/register')
    .get(isLoggedIn, isAdmin, users.renderRegister)
    .post(isLoggedIn, catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

router.route('/editprofile').get(isLoggedIn, users.renderEditForm)
    .post(isLoggedIn, users.updateUser)

module.exports = router;