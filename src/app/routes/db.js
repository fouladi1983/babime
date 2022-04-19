const mysql = require("mysql");
const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

module.exports = {
    mysqlConnection: mysqlConnection
};