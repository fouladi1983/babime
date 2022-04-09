const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

/****** User Sign Up *********************/

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.json({
        error: err
      });
    } else {
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: hash
      };

      let sql = `select id from users where email='${user.email}'`;
      con.query(sql, (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
          let sql = `insert into users(email,name,password) values('${user.email}', '${user.name}', '${user.password}')`;
          con.query(sql, (err, result) => {
            if (err) throw err;
            res.status(200).json({ result: result });
          });
        } else {
          return res.status(409).json({
            message: `user with this email address laready exists`
          });
        }
      });
    }
  });
});
/**************************** */

router.post("/login", (req, res, next) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  };

  let sql = `select * from users where email = '${user.email}'`;
  con.query(sql, (err, result) => {
    //if (err) throw err;
    bcrypt.compare(user.password, result[0].password, (err, result) => {
      if (result != true) {
        return res.status(401).json({
          error: "user or password is incorrect"
        });
      } else {
        return res.status(200).json({ message: `you are logged in` });
      }
    });
  });
});

/**************************** */

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({
    message: `User ID is ${id}`
  });
});

module.exports = router;
