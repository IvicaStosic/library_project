const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.get('/admin/add_book', adminController.getAddBook);

router.get('/admin/editor', adminController.getEditor);

router.get('/admin/edit_book/:bookId', adminController.getEditBook);

router.post('/admin/add_book', adminController.postAddBook);

router.post('/admin/edit_book', adminController.postEditBook);

router.post('/admin/delete_book', adminController.postDeleteBook);

module.exports = router;