const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/user");
const sqlRoutes = require("./routes/sql");
const consultantRoutes = require("./routes/consultant");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

///////////////Routes
app.use("/user", userRoutes);
app.use("/sql", sqlRoutes);
app.use("/consultant", consultantRoutes);
//////////////

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;