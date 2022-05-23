const express = require('express');
const router = express.Router();
const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';

const client = redis.createClient({url: REDIS_URL});
(async () => {
    await client.connect();
})();

router.get('/:bookId', async (req, res) => {
    const { bookId } = req.params;

    try{
        const cnt = await client.get(bookId);
        res.json({counter: cnt});
    }catch(e){
        console.log(e);
        res.statusCode(500).json({errcode: 500, errmsg: 'Ошибка Redis'});
    }
});

router.post('/:bookId/incr', async (req, res) => {
    const { bookId } = req.params;

    try{
        const cnt = await client.incr(bookId);
        res.json({counter: cnt});
    }catch(e){
        console.log(e);
        res.statusCode(500).json({errcode: 500, errmsg: 'Ошибка Redis'});
    }
});

module.exports = router;