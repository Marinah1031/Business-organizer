const mysql = require("mysql2");

const inquirer = require('inquirer');
const mysql = require("mysql2");
const express = require('express');
const app = express();

const connection = mysql.createConnection({
    host:"localhost",
    //username
    user: "",

    //password
    password: "",
    database: "department_db",
});
