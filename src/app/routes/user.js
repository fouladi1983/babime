const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

router.get("/", (req, res, nex) => {
  con.connect(err => {
    if (err) throw err;

    let sql = `CREATE TABLE users(
      id int not null AUTO_INCREMENT,
      name varchar(100),
      username varchar(100),
    PRIMARY KEY(id)
      )`;
    console.log(`Connected!`);
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.json({ message: result });
    });
  });
});

router.post("/", (req, res, nex) => {
  const user = {
    username: req.body.id,
    name: req.body.name
  };
  res.status(201).json({
    message: "User Post Middleware Works!..."
  });
});

router.get("/:id", (req, res, nex) => {
  const id = req.params.id;
  res.status(200).json({
    message: `User ID is ${id}`
  });
});

module.exports = router;
