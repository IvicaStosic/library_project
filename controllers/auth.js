const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login'
    })
}

exports.postLogin = (req, res, next) => {
    User.findById('5eb950f23904521f7c82a96e')
        .then(user => {
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));
}