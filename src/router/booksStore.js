const express = require('express');
const { getAllBooks, addBook, deleteBook } = require('../controller/booksStore');
const router = express.Router();

router.post('/books', addBook);
router.get('/books', getAllBooks);
router.delete('/books/:id', deleteBook);

module.exports = router;
