const express = require('express');
const router = express.Router();
const request = require('request');
const syncRequest = require('sync-request');
const { Books } = require('../models');

const COUNTER_URL = process.env.COUNTER_URL;
const COUNTER_PORT = process.env.COUNTER_PORT;

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

    try {
        for (key in books) {
            let res = syncRequest('GET', `http://${COUNTER_URL}:${COUNTER_PORT}/counter/${books[key].id}`);
            let cnt = JSON.parse(res.getBody('utf8'));
            books[key].counter = cnt.counter == null ? 0 : cnt.counter;
        }
        res.render("book/index", {
            title: "books",
            books: books,
            //counter: `http://${COUNTER_URL}:${COUNTER_PORT}/counter/`,
        });
    } catch (e) {
        res.render("book/index", {
            title: "books",
            books: books,
            //counter: `http://${COUNTER_URL}:${COUNTER_PORT}/counter/`,
        });
    }
});

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "books | create",
        book: {},
    });
});

router.post('/create', (req, res) => {
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

    let url = `http://${COUNTER_URL}:${COUNTER_PORT}/counter/${books[idx].id}/incr`;

    if (idx !== -1) {
        let promise = new Promise(function (resolve, reject) {
            try {
                request(url, { method: "POST" }, async (err, res, body) => {
                    if (err) {
                        reject(err);
                    }
                    counter = await JSON.parse(body);
                    resolve(counter.counter);
                });
            } catch (e) {
                reject(e);
            }
        });

        promise.then(
            (data) => {
                res.render("book/view", {
                    title: "books | view",
                    book: books[idx],
                    counter: data,
                });
            },
            (error) => {
                console.log('Ошибка запроса к Counter');
                console.log(error);

                res.render("book/view", {
                    title: "books | view",
                    book: books[idx],
                    counter: '',
                });
            }
        );
    } else {
        res.status(404).redirect('/404');
    }
});

router.get('/update/:id', (req, res) => {
    const { books } = db;
    const { id } = req.params;
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
