const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);
router.post(
  "/login",
  [
    check("username")
      .isString()
      .isLength({ min: 3 })
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((user) => {
          if (!user) {
            return Promise.reject(
              "User registered with that username does not exist."
            );
          }
        });
      })
      .trim(),
    check(
      "password",
      "Invalid password. Please enter a password at least 8 characters long."
    ).isLength({ min: 8 }),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post(
  "/signup",
  [
    check("firstName")
      .isString()
      .isLength({ min: 3, max: 30 })
      .withMessage("First name must be between 3 and 30 characters long.")
      .trim(),
    check("lastName")
      .isString()
      .isLength({ min: 3, max: 30 })
      .withMessage("Last name must be between 3 and 30 characters long.")
      .trim(),
    check("location")
      .isString()
      .isLength({ min: 2, max: 30 })
      .withMessage("Location name must be between 3 and 30 characters long.")
      .trim(),
    check("email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "E-mail already in use, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    check("username")
      .isString()
      .isLength({ min: 2, max: 15 })
      .withMessage("Username must be between 2 and 15 characters long.")
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "Username already in use, please pick a different one"
            );
          }
        });
      }),
    check("password")
      .isString()
      .isLength({ min: 8, max: 12 })
      .withMessage("First name must be between 8 and 12 characters long."),
    check("confirmPassword")
      .isString()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.post("/reset", authController.postReset);
router.post("/new_password", authController.postNewPassword);

module.exports = router;
