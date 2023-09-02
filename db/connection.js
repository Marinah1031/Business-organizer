// importation of the dotenv library that allows the .env files to be in the Node.js environment
require('dotenv').config()
//Imports the mysql12 library 
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    //username
    user: process.env.DB_USER,

    //password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
//connects to the MySQL database using the connection object and takes the callback function 
//as its argument
connection.connect(
    function (err) {
        if (err) {
            throw (err)
        }
    }
);

//Allows the other parts of my application to connect to this file
module.exports = connection;