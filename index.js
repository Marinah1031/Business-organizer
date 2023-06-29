const inquirer = require('inquirer');
const mysql = require("mysql2");

function start () {
    inquirer
        .prompt({
            type:"list",
            name:"action",
            message:"What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
            ],
        })
    }
const prompt_questions = () => {
    inquirer
    .prompt(questions)
    .then((answers) => {
     console.log(answers);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
};

//call prompt questions
prompt_questions ()