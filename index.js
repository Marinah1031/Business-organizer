const inquirer = require('inquirer');
const mysql = require("mysql2");


function prompt_questions () {
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
        .then((answer) => {
            switch (answer.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addAdepartment();
                    break;
                case "Add a role":
                    addArole();
                    break;
                case "Add an employee":
                    addAnEmployee();
                    break;
                case "Update an employee role":
                    updateAnEmployeeRole();
                    break;
                case "Exit":
                    connection.end();
                    console.log("Done");
                    break;
            }
        })
    }
    //function to view the departments from the table
    function viewAllDepartments() {
        const query = "SELECT * FROM departments";
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
            prompt_questions();
        })
    }
// const prompt_questions = () => {
//     inquirer
//     .prompt(questions)
//     .then((answers) => {
//      console.log(answers);
//     })
//     .catch((error) => {
//       if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
    //   } else {
        // Something else went wrong
//       }
//     });
// };

//call prompt questions
prompt_questions ()