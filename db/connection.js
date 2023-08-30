require('dotenv').config()
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    //username
    user: process.env.DB_USER,

    //password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(
    function (err) {
        if (err) {
            throw (err)
        }
    }
);
module.exports = connection;