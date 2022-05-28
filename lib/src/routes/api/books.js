const express = require('express');
const router = express.Router();
const Book = require('../../models/Books');

const fileMiddleware = require('../../middleware/file');
const coverMiddleware = require('../../middleware/cover');

router.get('/err', (req, res) => {
    throw new Error('Возникла ошибка!');
});

router.get('/', async (req, res) => {
    const books = await Book.find().select('-__v');
    res.json(books);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id).select('-__v');

        book.views++;
        try {
            await Book.findByIdAndUpdate(id, { views: book.views });
        } catch (e) {
            console.error(e);
        }
        
        res.json(book);
    } catch (e) {
        console.error(e);
        res.status(500).redirect('/err');
    }
});

router.post('/', async (req, res) => {
    let { title, description, authors, favorite } = req.body;
    
    favorite = favorite === undefined ? false : true;
    
    const newLib = new Book({
        title: title,
        description: description,
        authors: authors,
        favorite: favorite,
    });

    try {
        await newLib.save();
        res.json(newLib);
    } catch (e) {
        console.error(e);
        res.status(500).redirect('/err');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    let { title, description, authors, favorite } = req.body;

    favorite = favorite === undefined ? false : true;
    
    try {
        await Book.findByIdAndUpdate(id, { title, description, authors, favorite });
        res.redirect(`/api/book/${id}`);
    } catch (e) {
        console.error(e);
        res.status(500).redirect('/err');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Book.deleteOne({ _id: id });
        res.json(true);
    } catch (e) {
        console.error(e);
        res.status(500).redirect('/err');
    }
});

module.exports = router;