const Book = require('../models/book');

exports.getBooks = (req, res, next) => {
  Book
    .find()
    .then(books => {
      console.log(books)
      res.render('library_open/library', {
        books: books,
        pageTitle: 'Library',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
};