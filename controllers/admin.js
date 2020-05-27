const Book = require("../models/book");
const { validationResult } = require("express-validator/check");

exports.getAddBook = (req, res, next) => {
  res.render("admin/edit_book", {
    pageTitle: "Add Book",
    path: "/admin/add_book",
    editing: false,
    hasError: false,
    book: {
      title: "",
      author: "",
      description: "",
    },
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddBook = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit_book", {
      pageTitle: "Add Book",
      path: "/admin/edit_book",
      editing: false,
      hasError: true,
      book: {
        title: title,
        author: author,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const book = new Book({
    title: title,
    author: author,
    description: description,
    userId: req.user,
  });
  book
    .save()
    .then((result) => {
      console.log("New book added into library");
      res.redirect("/admin/add_book");
    })
    .catch((err) => console.log(err));
};

exports.getEditor = (req, res, next) => {
  Book.find()
    .then((books) => {
      console.log(books);
      res.render("admin/editor", {
        books: books,
        pageTitle: "Editor",
        path: "/admin/editor",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditBook = (req, res, next) => {
  const editing = req.query.edit;
  if (!editing) {
    return res.redirect("/");
  }
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .then((book) => {
      res.render("admin/edit_book", {
        book: book,
        pageTitle: "Edit Book",
        path: "/admin/edit_book",
        editing: editing,
        book: book,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditBook = (req, res, next) => {
  //console.log(req.body.bookId);
  const bookId = req.body.bookId;
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit_book", {
      pageTitle: "Edit Book",
      path: "/admin/edit_book",
      editing: true,
      hasError: true,
      book: {
        title: title,
        author: author,
        description: description,
        _id: bookId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Book.findById(bookId)
    .then((book) => {
      book.title = title;
      book.author = author;
      book.description = description;
      return book.save();
    })
    .then((result) => {
      console.log("Book has been edited");
      res.redirect("/admin/editor");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteBook = (req, res, next) => {
  const bookId = req.body.bookId;

  Book.findByIdAndRemove(bookId).then((result) => {
    console.log("Book deleted from library");
    res.redirect("/admin/editor");
  });
};
