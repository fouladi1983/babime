const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const environment = require(`../../environment.json`);
const sendEmail = require('./send-email');
const { mysqlConnection } = require("./db");

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
                password: hash,
                isAdmin: req.body.isAdmin
            };

            let sql = `select id from users where email='${user.email}'`;
            mysqlConnection.query(sql, (err, result) => {
                if (err) return res.status(500).json({ error: err });

                if (result.length === 0) {
                    let sql = `insert into users(email,name,password) values('${user.email}', '${user.name}', '${user.password}')`;
                    mysqlConnection.query(sql, (err, result) => {
                        if (err) return res.status(500).json({ error: err });
                        let adminRoleQuery = `insert into roles(isAdmin, userId) values('1', '${result.insertId}')`;
                        let notAdminRoleQuery = `insert into roles(isAdmin, userId) values('0','${result.insertId}')`;
                        if (user.isAdmin) {
                            mysqlConnection.query(adminRoleQuery, (err, roleResult) => {
                                if (err) return res.status(500).json({ error: err });
                            });
                        } else {
                            mysqlConnection.query(notAdminRoleQuery, (err, roleResult) => {
                                if (err) return res.status(500).json({ error: err });
                            });
                        }

                        let userActivationQuery = `insert into userActivation(userId) values('${result.insertId}')`;
                        mysqlConnection.query(userActivationQuery, (err, actResult) => {
                            if (err) return res.status(500).json({ error: err });

                            if (actResult) {
                                sendEmail(user.email, result.insertId);
                            }
                        });

                        return res.status(200).json({ result: result });
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
    mysqlConnection.query(sql, (err, userResult) => {
        if (err) return res.status(500).json({ error: err });

        if (userResult.length < 1)
            return res.status(401).json({ message: `Auth Failed` });

        bcrypt.compare(user.password, userResult[0].password, (err, cmpResult) => {
            if (err) return res.json({ error: err });

            if (cmpResult != true) {
                return res.status(401).json({
                    error: "user or password is incorrect"
                });
            } else {
                const token = jwt.sign({
                        userId: userResult[0].id
                    },
                    environment.env.JWT_KEY, { expiresIn: "2 days" }
                );
                return res.status(200).json({ token: token });
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

/**************************** */
/******** USER ACTIVATION *** */
router.post("/user-activation", (req, res, next) => {
    const activationKey = req.body.activationKey;
    const query = `update useractivation
                    set isActive = 1
                    where activationKey='${activationKey}'`;
    mysqlConnection.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err });

        res.status(200).json({ message: 'user activated' });
    });
});
/**************************** */

module.exports = router;