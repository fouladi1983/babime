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
      name varchar(255) COLLATE utf8_unicode_ci,
      email varchar(255) COLLATE utf8_unicode_ci,
      password varchar(250),
      PRIMARY KEY(id)
      )`;
  con.query(userTableQuery, (err, result) => {
    if (err) throw err;
  });

  let roleTableQuery = `create table roles(
    id int not null AUTO_INCREMENT,
    userId int,
    isAdmin binary,
    PRIMARY KEY(id)
  )`;

  con.query(roleTableQuery, (err, result) => {
    if (err) throw err;
  });

  let consultantsTableQuery = `create table consultants(
    id int not null AUTO_INCREMENT,
    creatorId int,
    title varchar(255) COLLATE utf8_unicode_ci,
    description text COLLATE utf8_unicode_ci,
    PRIMARY KEY(id)
  )`;

  con.query(consultantsTableQuery, (err, result) => {
    if (err) throw err;
  });

  let consultAnswersQuery = `create table consultAnswers(
    id int not null AUTO_INCREMENT,
    insurerId int,
    consultantId int,
    answer text COLLATE utf8_unicode_ci,
    PRIMARY KEY(id)
  )`;

  res.json({ message: `sql script....` });
});

module.exports = router;
