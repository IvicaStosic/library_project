const express = require("express");
const adminController = require("../controllers/admin");
const authenticated = require("../middleware/authenticated");
const router = express.Router();
const { check } = require("express-validator/check");

router.get("/admin/add_book", authenticated, adminController.getAddBook);

router.get("/admin/editor", authenticated, adminController.getEditor);

router.get(
  "/admin/edit_book/:bookId",
  authenticated,
  adminController.getEditBook
);

router.post(
  "/admin/add_book",
  [
    check(
      "title",
      "Please enter valid book title that is at least 1 character long"
    )
      .isString()
      .isLength({ min: 1, max: 50 })
      .trim(),
    check(
      "author",
      "Please enter valid author name that is at least 1 character long"
    )
      .isString()
      .isLength({ min: 1, max: 50 })
      .trim(),
    check(
      "description",
      "Please enter valid book description that is at least 1 and no more than 500 characters long"
    )
      .trim()
      .isString()
      .isLength({ min: 1, max: 500 }),
  ],
  authenticated,
  adminController.postAddBook
);

router.post(
  "/admin/edit_book",
  [
    check(
      "title",
      "Please enter valid book title that is at least 1 character long"
    )
      .isString()
      .isLength({ min: 1, max: 50 })
      .trim(),
    check(
      "author",
      "Please enter valid author name that is at least 1 character long"
    )
      .isString()
      .isLength({ min: 1, max: 50 })
      .trim(),
    check(
      "description",
      "Please enter valid book description that is at least 1 and no more than 500 characters long"
    )
      .trim()
      .isString()
      .isLength({ min: 1, max: 500 }),
  ],
  authenticated,
  adminController.postEditBook
);

router.post(
  "/admin/delete_book",
  authenticated,
  adminController.postDeleteBook
);

module.exports = router;
