const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const booksRouter = require('./router/booksStore');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://vijju:Vijju143@cluster0.ygbul.mongodb.net/books?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database Connected");
})
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

app.use(cors());
app.use(express.json());
app.use('/publicBook', express.static(path.join(__dirname, 'Uploads')));

app.use('/api', booksRouter);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
