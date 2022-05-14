const express = require('express');
const router = express.Router();
const { Books } = require('../models');

const db = {
    books: [],
};

[1, 2, 3].map(el => {
    const newLib = new Books(`title book ${el}`, `description book ${el}`, `authors book ${el}`, false, '', '', '', `id${el}`);
    db.books.push(newLib);
});

router.get('/err', (req, res) => {
    throw new Error('Возникла ошибка!');
});

router.get('/', (req, res) => {
    const { books } = db;
    res.render("book/index", {
        title: "books",
        books: books,
    });
});

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "books | create",
        book: {},
    });
});

router.post('/create', (req, res) => {
    console.log(req.body);
    console.log(333);
    const { books } = db;
    const { title, description, authors, favorite } = req.body;

    const newLib = new Books(title, description, authors, favorite);
    books.push(newLib);

    res.status(201).redirect('/books')
});

router.get('/:id', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.render("book/view", {
            title: "books | view",
            book: books[idx],
        });
    } else {
        res.status(404).redirect('/404');
    }
});

router.get('/update/:id', (req, res) => {
    const { books } = db;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.render("book/update", {
            title: "books | view",
            book: books[idx],
        });
    } else {
        res.status(404).redirect('/404');
    }
});

router.post('/update/:id', (req, res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(444);
    const { books } = db;
    const { title, description, authors, favorite } = req.body;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite
        };
        res.redirect(`/books/${id}`);
    } else {
        res.status(404).redirect('/404');
    }
});

router.post('/delete/:id', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books.splice(idx, 1);
        res.redirect(`/books`);
    } else {
        res.status(404).redirect('/404');
    }
});

module.exports = router;
