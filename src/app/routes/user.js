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
                insurerCode: req.body.insurerCode,
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
                                sendEmail.sendActivation(user.email, result.insertId);
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

/****** Resend Activation *****************/
router.post("/resend-activation", (req, res, next) => {
        const email = req.body.email;
        const userQuery = `select id from users where email='${email}'`;
        mysqlConnection.query(userQuery, (err, userResult) => {
            if (userResult.length < 1) {
                res.status(404).json({ error: 'کاربری با این آدرس ایمیل وجود ندارد' });
            }

            if (err) {
                res.status(500).json({ error: `در ارسال ایمیل فعالسازی خطایی پیش آمده لطفا دوباره تلاش نمایید` });
            } else {
                console.log(userResult[0].id)
                const activationKeyQuery = `select activationKey from useractivation where userId='${userResult[0].id}'`;
                mysqlConnection.query(activationKeyQuery, (err, activationResult) => {
                    if (err) {
                        res.status(500).json({ error: `در ارسال ایمیل فعالسازی خطایی پیش آمده لطفا دوباره تلاش نمایید` });
                    } else {
                        const mailOption = {
                            from: 'm.r.fouladi7@gmail.com',
                            to: email,
                            subject: 'مشاور بیمه گر',
                            html: `
                                <section style=" width: 50vw;
                                margin: auto;
                                text-align: center;
                                border: 1px solid blueviolet;
                                height: 50vh;">
                                    <div class="header" style="background-color: blueviolet;
                                    color: white;">
                                    <h1>مشاور بیمه گر</h1>
                                    </div>
                                    <div class="description" style="margin-top: 5vh;">
                                    برای تایید حساب کاربری بر روی لینک زیر کلیک کنید
                                    </div>
                                    <a href="http://localhost:4200/auth/user-activation/${activationResult[0].activationKey}" target="_blank">http://localhost:4200/user-activation</a>
                                </section>`
                        };
                        sendEmail.transporter.sendMail(mailOption, (error, info) => {
                            if (error) {
                                res.status(500).json({ error: `در ارسال ایمیل فعالسازی خطایی پیش آمده لطفا دوباره تلاش نمایید` });
                            } else {
                                res.status(201).json({ message: `ایمیل فعالسازی با موفقیت ارسال شد` });
                            }
                        });
                    }
                });
            }
        });
    })
    /****** ************ *********************/

/****** LOGIN *****************/

router.post("/login", (req, res, next) => {
    let user = {
        email: req.body.email,
        password: req.body.password
    };



    const sql = `select * from users where email = '${user.email}'`;
    mysqlConnection.query(sql, (err, userResult) => {
        if (err) return res.status(500).json({ error: err });

        if (userResult.length < 1)
            return res.status(401).json({ message: `کاربری با این ایمیل آدرس وجود ندارد` });

        const checkActiveQuery = `select isActive from useractivation where userId='${userResult[0].id}'`;
        mysqlConnection.query(checkActiveQuery, (err, checkActiveResult) => {
            if (err) return res.status(500).json({ error: err });
            console.log(userResult[0].password);
            console.log(user.password);
            if (checkActiveResult[0].isActive !== 1)
                return res.status(403).json({ error: 'کاربر فعال نیست' });

            bcrypt.compare(user.password, userResult[0].password, (err, cmpResult) => {
                console.log(cmpResult)
                if (err) return res.json({ error: err });

                if (cmpResult != true) {
                    return res.status(401).json({
                        error: "پسورد اشتباه است"
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
        if (err) return res.status(500).json({ error: `فعال سازی حساب کاربری با کلید درخواست شده با خطا مواجه است` });

        res.status(200).json({ message: 'user activated' });
    });
});
/**************************** */

/********* RESET PASSWORD *** */
router.post('/reset-password-request', (req, res, next) => {
    const email = req.body.email;
    if (!email) {
        res.status(400).json({ error: `ایمیل نمیتواند خالی باشد` });
        return;
    }
    const userQuery = `select id from users where email='${email}'`;
    mysqlConnection.query(userQuery, (err, userResult) => {
        if (userResult.length < 1) res.status(404).json({ error: 'کاربری با این آدرس ایمیل یافت نشد' });
        if (err) res.status(500).json({ error: err });

        const createResetPassQuery = `insert into resetpassword(userId) values('${userResult[0].id}')`;
        mysqlConnection.query(createResetPassQuery, (err, createResetPassQuery) => {
            if (err) res.status(500).json({ error: err });

            sendEmail.sendResetPassword(email, userResult[0].id);
            res.status(201).json({ message: `درخواست تغییر رمز به ایمیل کاربر ارسال گردید` })
        });
    });
});

router.post(`/reset-password-confirm`, (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({
                error: err
            });
        } else {
            const resetKey = req.body.resetPassKey;
            const resetPassKeyQuery = `select id,userId from resetpassword where resetPasswordKey='${resetKey}'`;
            mysqlConnection.query(resetPassKeyQuery, (err, resetPassResult) => {
                if (err) res.status(500).json({ error: `کاربر مجاز به تغییر رمز عبور نیست` });

                const userQuery = `update users
                                    set password = '${hash}'
                                    where id = '${resetPassResult[0].userId}'`;
                mysqlConnection.query(userQuery, (err, userResult) => {
                    if (err) return res.status(500).json({ error: err });
                    const deleteFromResetPassword = `delete from resetpassword where resetPasswordKey='${resetKey}'`;
                    mysqlConnection.query(deleteFromResetPassword);
                    res.status(201).json({ message: `رمز عبور کاربر با موفقیت تغییر کرد` });
                });
            })
        }
    });
});
/**************************** */

module.exports = router;