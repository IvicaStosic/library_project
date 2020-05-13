const Book = require('../models/book')

exports.getAddBook = (req, res, next) => {
    res.render('admin/edit_book', {
        pageTitle: 'Add Book',
        path: '/admin/add_book',
        editing: false
    })
}

exports.postAddBook = (req, res, next) => {
    const title = req.body.title;
    const author = req.body.author;
    const description = req.body.description;

    const book = new Book({
        title: title,
        author: author,
        description: description,
        userId: req.user
    });
    book
        .save()
        .then(result => {
            console.log('New book added into library')
            res.redirect('/admin/add_book')
        })
        .catch(err => console.log(err))
};

exports.getEditor = (req, res, next) => {
    Book
        .find()
        .then(books => {
            console.log(books)
            res.render('admin/editor', {
                books: books,
                pageTitle: 'Editor',
                path: '/admin/editor',
                editing: true
            })
        })
        .catch(err => console.log(err))
}

exports.getEditBook = (req, res, next) => {
    const editing = req.query.edit;
    if (!editing) {
        return res.redirect('/')
    }
    const bookId = req.params.bookId;
    Book
        .findById(bookId)
        .then(book => {
            res.render('admin/edit_book', {
                book: book,
                pageTitle: 'Edit Book',
                path: '/admin/edit_book',
                editing: editing
            })
        })
        .catch(err => console.log(err))
}

exports.postEditBook = (req, res, next) => {
    console.log(req.body.bookId)
    const bookId = req.body.bookId;
    const newTitle = req.body.title;
    const author = req.body.author;
    const description = req.body.description;

    Book
        .findById(bookId)
        .then(book => {
            book.title = newTitle;
            book.author = author;
            book.description = description;
            return book.save();
        })
        .then(result => {
            console.log('Book has been edited')
            res.redirect('/admin/editor');
        })
        .catch(err => console.log(err));
}

exports.postDeleteBook = (req, res, next) => {
    const bookId = req.body.bookId;

    Book
        .findByIdAndRemove(bookId)
        .then(result => {
            console.log('Book deleted from library')
            res.redirect('/admin/editor')
        })
}