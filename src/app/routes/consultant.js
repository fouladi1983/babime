const express = require("express");
const con = require("./db");
const router = express.Router();

router.get("/:id", (req, res, next) => {
  const userId = req.params.userId;
  const query = `select * from consultants as con
                join consultAnswers as ans
                on ans.consultantId = con.id
                where con.creatorId='${userId}'`;
  con.mysqlConnection.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({ result });
  });
});

router.post("/", (req, res, next) => {
  const consultant = {
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description
  };

  let consultQuery = `insert into consultants(creatorId,title,description) values('${consultant.userId}','${consultant.title}','${consultant.description}')`;
  con.mysqlConnection.query(consultQuery, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({ message: `created successfully` });
  });
});

module.exports = router;
