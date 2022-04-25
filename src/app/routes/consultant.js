const express = require("express");
const con = require("./db");
const router = express.Router();

router.get("/user/:id", (req, res, next) => {
  const userId = req.params.id;
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

router.patch("/consultant", (req, res, next) => {
  const patchObj = {
    consultId: req.params.id,
    editedConsult: req.body.consult
  };
  const consultPatchQuery = `update consultants
                                set description='${patchObj.editedConsult}'
                                where id='${patchObj.consultId}'`;
  con.mysqlConnection.query();
});

module.exports = router;
