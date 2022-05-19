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
    let userTableQuery = `CREATE TABLE IF NOT EXISTS users(
      id int not null AUTO_INCREMENT,
      name varchar(255) COLLATE utf8_unicode_ci,
      email varchar(255) COLLATE utf8_unicode_ci,
      password varchar(250),
      PRIMARY KEY(id)
      )`;
    con.query(userTableQuery, (err, usersResult) => {
        if (err) throw err;
    });

    let userActivation = `CREATE TABLE IF NOT EXISTS userActivation(
      id int not null AUTO_INCREMENT,
      userId int not null,
      isActive binary DEFAULT 0,
      activationKey varchar(20) NOT NULL DEFAULT UUID(),
      PRIMARY KEY(id)
    )`

    con.query(userActivation, (err, atcResult) => {
        if (err) throw err;
    });

    let roleTableQuery = `CREATE TABLE IF NOT EXISTS roles(
    id int not null AUTO_INCREMENT,
    userId int,
    isAdmin binary,
    PRIMARY KEY(id)
  )`;

    con.query(roleTableQuery, (err, roleResult) => {
        if (err) throw err;
    });

    let consultantsTableQuery = `CREATE TABLE IF NOT EXISTS consultants(
    id int not null AUTO_INCREMENT,
    creatorId int,
    title varchar(255) COLLATE utf8_unicode_ci,
    description text COLLATE utf8_unicode_ci,
    PRIMARY KEY(id)
  )`;

    con.query(consultantsTableQuery, (err, consResult) => {
        if (err) throw err;
    });

    let consultAnswersQuery = `CREATE TABLE IF NOT EXISTS consultAnswers(
    id int not null AUTO_INCREMENT,
    insurerId int,
    consultantId int,
    answer text COLLATE utf8_unicode_ci,
    PRIMARY KEY(id)
  )`;

    con.query(consultAnswersQuery, (err, consAnswerResult) => {
        if (err) throw err;
    });

    res.json({ message: `sql script....` });
});

module.exports = router;