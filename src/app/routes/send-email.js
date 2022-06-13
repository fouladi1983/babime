const nodeMailer = require('nodemailer');
const { mysqlConnection } = require('./db');

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {},
    subject: 'فعالسازی حساب کاربری'
});

function sendActivation(email, userId) {
    const activationKeyQuery = `select activationKey from useractivation where userId='${userId}'`;
    mysqlConnection.query(activationKeyQuery, (err, actResult) => {
        if (err) throw err;

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
                <a href="http://localhost:4200/auth/activation/${actResult[0].activationKey}" target="_blank">http://localhost:4200/auth/activation</a>
            </section>`
        };

        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log(error)
                throw error(info.response);
            } else {
                console.log('email sent:' + info.response);
            }
        });
    });
}

function sendResetPassword(email, userId) {
    const resetPassKeyQuery = `select resetPasswordKey from resetpassword where userId='${userId}'`;
    mysqlConnection.query(resetPassKeyQuery, (err, resetPassResult) => {
        if (err) throw err;

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
                برای تغییر رمز عبور بر روی لینک زیر کلیک کنید
                </div>
                <a href="http://localhost:4200/auth/reset-password/${resetPassResult[0].resetPasswordKey}" target="_blank">http://localhost:4200/reset-password</a>
            </section>`
        };

        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('email sent:' + info.response);
            }
        });
    });
}

module.exports = { sendActivation, transporter, sendResetPassword };