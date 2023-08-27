const inquirer = require('inquirer');
const mysql = require("mysql2");
const express = require('express');
const app = express();

const connection = mysql.createConnection({
    host:"localhost",
    //username
    user: "root",

    //password
    password: "Marinah1031",
    database: "department_db",
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
      }
      console.log('Connected to the database as ID ' + connection.threadId);
    });


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
// Viewing all employees

function viewAllEmployees() {
    db.findAllEmployees()
    .then(([rows])=> {
        let employees = rows;
        console.table(employees);
    })
    .then(() => prompt_questions())
}
  
    //function to view the departments from the table
    function viewAllDepartments() {
        const query = "SELECT * FROM department";
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
            prompt_questions();
        });
    }

    function viewAllRoles() {
        const query = "SELECT * FROM roles";
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.table(res);
          prompt_questions();
        });
      }

      
    function viewAllEmployees() {
        const query = "SELECT * FROM employee";
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.table(res);
          prompt_questions();
        });
      }
    
    function viewAllEmployees() {
        const query = "SELECT * FROM employee";
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.table(res);
          prompt_questions();
        });
      }

      function updateAnEmployeeRole() {
        db.findAllEmployeesAllEmployees()
        .then(([rows]) => {
            let employyes = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name}) => 
            ({ name: `${first_name} ${last_name}` , value: id }) );

            prompt([
                { 
                type: 'list', 
                name: "employeeId",
                message: `Which employee's role would you like to change?`, 
                choices: employeeChoices }
            ])
            .then(res => {
                let employeeId = res.employeeId;
                db.viewAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title}) => ({
                        name: `${title}`,
                        value: id
                    }));

                    prompt([
                        {
                            type: 'list',
                            name: "roleId",
                            message: `What is the new role of this employee?`,
                            choices: roleChoices
                        }
                    ])
                    .then(res => db.updateAnEmployeeRole(employeeId, res.roleId))
                    .then(() => console.log("Updated Employee's role"))
                    .then(() => prompt_questions())
                })
            })
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

