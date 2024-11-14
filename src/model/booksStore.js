const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: false },
  comments: { type: String, required: false },
  image: { type: String } 
});

module.exports = mongoose.model('Book', BookSchema);