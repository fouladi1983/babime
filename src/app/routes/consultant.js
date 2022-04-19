const express = require('express');
const con = require('./db');
const router = express.Router();

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    const query = `select * from consultants where id='${id}'`;
    con.mysqlConnection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        };

        res.status(200).json({ result });
    });
});

router.post('/', (req, res, next) => {
    const consultant = {
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
    };
})

module.exports = router;