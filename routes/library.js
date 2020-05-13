const express = require('express');
const libraryController = require('../controllers/library');
const router = express.Router();

router.get('/', libraryController.getBooks);

module.exports = router;