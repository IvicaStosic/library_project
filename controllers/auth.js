const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9b9ad562fd81f5",
    pass: "c14fe37f815669",
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  console.log(message);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      username: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const errors = validationResult(req);
  //console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        username: username,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          pageTitle: "Login",
          path: "/login",
          errorMessage: "Invalid username or password.",
          oldInput: {
            username: username,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((matching) => {
          if (matching) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            errorMessage: "Invalid username or password.",
            oldInput: {
              username: username,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  console.log(message);
  if (message.length > 0) {
    message = message[0];
    console.log(message);
    return res.redirect("/signup");
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Register",
    path: "/signup",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      firstName: "",
      lastName: "",
      location: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthday = req.body.birthday;
  const gender = req.body.gender;
  const location = req.body.location;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Register",
      path: "/signup",
      oldInput: {
        firstName: firstName,
        lastName: lastName,
        location: location,
        email: email,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((securedPassword) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        birthday: birthday,
        gender: gender,
        location: location,
        email: email,
        username: username,
        password: securedPassword,
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "library.project@test.com",
        subject: "Registration successful",
        html: `<h1>Wellcome to the library ${firstName}</h1>`,
      });
    })
    .catch((err) => console.log(err));
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash(
            "error",
            "No account registered with that email found, would you like to Register?"
          );
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "library.project@test.com",
          subject: "Reseting password",
          html: `<h1>Greetings from library</h1>
      <p>You requested to reset your password for using library.</p>
      <br/>
      <p>Here is a link that will enable you to do so <a href="http://localhost:3000/reset/${token}">link</a></p>
      <p>If it wasn't You that requested password change, pleasee ignore this notification.</p>`,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new_password", {
        pageTitle: "New Password",
        path: "/new_password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordResetToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordResetToken = req.body.passwordResetToken;
  let resetUser;
  User.findOne({
    resetToken: passwordResetToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((securedPassword) => {
      resetUser.password = securedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
