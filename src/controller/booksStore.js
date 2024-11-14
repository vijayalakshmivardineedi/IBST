const Book = require('../model/booksStore');
const multer = require('multer');
const shortid = require("shortid");
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, '../Uploads');
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  }
});

const upload = multer({ storage }).single('image');

exports.addBook = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'An error occurred while uploading the file.' });
      }
      try {
        const { title, author, description, rating, comments } = req.body;
        let image = '';

        if (req.file) {
          image = `/publicBook/${req.file.filename}`;
        }

        const book = new Book({ title, author, description, rating, comments, image });
        await book.save();

        return res.status(201).json({ success: true, book, message: 'Book added successfully.' });
      } catch (error) {
        console.error('Error creating book:', error);
        return res.status(500).json({ success: false, message: error.message });
      }
    });
  } catch (error) {
    console.error('Error uploading product file:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while uploading the book file.' });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'An error occurred while uploading file.' });
      }
      try {
        const { title, author, description, rating, comments } = req.body;
        let image = [];

        if (req.files && req.files['image']) {
          image = req.files['image'].map(file => ({
            img: `/publicBook/${file.filename}`
          }));
        }

        const updatedData = { title, author, description, rating, comments };
        if (image.length > 0) updatedData.image = image;

        const book = await Book.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!book) return res.status(404).json({ message: "Book not found" });

        return res.json({ success: true, book, message: 'Book updated successfully.' });
      } catch (error) {
        console.error('Error updating book:', error);
        return res.status(500).json({ success: false, message: 'Error updating book.' });
      }
    });
  } catch (error) {
    console.error('Error updating product files:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while updating book files.' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Delete the image if it exists
    if (book.image) {
      const filePath = path.join(__dirname, '../Uploads', path.basename(book.image));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete the book from the database
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

