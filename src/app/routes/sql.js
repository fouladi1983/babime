const mysql = require("mysql");
const express = require(`express`);
const router = express.Router();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

router.get("/create-tables", (req, res, nex) => {
  con.connect(err => {
    if (err) throw err;

    let sql = `CREATE TABLE users(
      id int not null AUTO_INCREMENT,
      name varchar(100),
      username varchar(100),
    PRIMARY KEY(id)
      )`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.json({ message: result });
    });
  });

  con.end();
});

module.exports = router;
