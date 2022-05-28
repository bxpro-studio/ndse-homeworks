const express = require('express');
const router = express.Router();
const Book = require('../models/Books');

router.get('/err', (req, res) => {
    throw new Error('Возникла ошибка!');
});

router.get('/', async (req, res) => {
    try {
        const book = await Book.find();

        res.render("book/index", {
            title: "Book",
            books: book,
        });
    } catch (e) {
        console.log(e);
        res.status(500).redirect('/err');
    }
});

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "books | create",
        book: {},
    });
});

router.post('/create', async (req, res) => {
    let { title, description, authors, favorite } = req.body;

    favorite = favorite === undefined ? false : true;
    
    const newLib = new Book({
        title, description, authors, favorite
    });

    try {
        await newLib.save();
        res.status(201).redirect('/books');
    } catch (e) {
        console.error(e);
        res.status(500).redirect('/err');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let book;

    try {
        book = await Book.findById(id);

        book.views++;
        try {
            await Book.findByIdAndUpdate(id, { views: book.views });
        } catch (e) {
            console.error(e);
        }
        
        res.render("book/view", {
            title: "books | view",
            book: book,
        });
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }
});

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    let book;

    try {
        book = await Book.findById(id);
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.render("book/update", {
        title: "books | view",
        book: book,
    });
});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    let { title, description, authors, favorite } = req.body;

    favorite = favorite === undefined ? false : true;
    
    try {
        await Book.findByIdAndUpdate(id, { title, description, authors, favorite });
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.redirect(`/books/${id}`);
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Book.deleteOne({ _id: id });
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.redirect(`/books`);
});

module.exports = router;