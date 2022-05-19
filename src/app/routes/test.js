const express = require(`express`);
const { mysqlConnection } = require("./db");
const router = express.Router();
router.get('', (req, res, next) => {
    let query = `select activationKey from useractivation where userId='12'`
    mysqlConnection.query(query, (err, result) => {
        console.log(result);
    })
})
module.exports = router;