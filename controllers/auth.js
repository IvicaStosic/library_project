const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false
  });
};
/**First take care of this!!!! */
exports.postLogin = (req, res, next) => {
  User.findOne({ username: username, password: password })
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      })
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Register',
    path: '/signup',
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dateOfBirth = req.body.dateOfBirth;
  const gender = req.body.gender;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User
    .findOne({ username: username, email: email })
    .then(user => {
      if (user) {
        return res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(securedPassword => {
          const user = new User({
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            email: email,
            username: username,
            password: securedPassword
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login')
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}