const express = require("express");
const { json } = require("express/lib/response");
const con = require("./db");
const router = express.Router();

router.post("/", (req, res, next) => {
  const answer = {
    insurerId: req.body.insurerId,
    consultId: req.body.consultId,
    answer: req.body.answer
  };

  const answerQuery = `insert into consultAnswers(insurerId,consultantId,answer) values('${answer.insurerId}','${answer.consultId}','${answer.answer}')`;
  con.mysqlConnection.query(answerQuery, (err, result) => {
    if (err) {
      res.status(500), json({ error: err });
    }

    res.status(200).json({ message: `answer created successfully` });
  });
});

router.patch("/answer", (req, res, next) => {
  const patchObj = {
    answerId: req.params.id,
    editedAnswer: req.body.answer
  };

  const patchAnswerQuery = `update answer
                              set answer='${patchObj.editedAnswer}'
                              where id='${patchObj.answerId}'`;

  con.mysqlConnection.query(patchAnswerQuery, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json({ message: `answer updated successfully` });
  });
});

module.exports = router;
