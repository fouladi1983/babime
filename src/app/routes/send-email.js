const nodeMailer = require('nodemailer');
const { mysqlConnection } = require('./db');

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'm.r.fouladi7@gmail.com',
        pass: '1@wagatsu',
    },
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
                <a href="http://localhost:4200/activation/${actResult[0].activationKey}" target="_blank">http://localhost:4200/activation</a>
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

module.exports = sendActivation;