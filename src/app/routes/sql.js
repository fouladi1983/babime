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
  let userTableQuery = `CREATE TABLE users(
      id int not null AUTO_INCREMENT,
      name varchar(100),
      email varchar(100),
      password varchar(250),
      PRIMARY KEY(id)
      )`;
  con.query(userTableQuery, (err, result) => {
    if (err) throw err;

    res.json({ result: result });
  });

  let roleTableQuery = `create table roles(
    id int not null AUTO_INCREMENT,
    userId int,
    isAdmin binary,
    PRIMARY KEY(id)
  )`;
});

module.exports = router;
