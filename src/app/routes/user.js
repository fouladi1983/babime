const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
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
