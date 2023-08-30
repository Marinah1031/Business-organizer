const inquirer = require('inquirer');
const mysql = require("mysql2");
const express = require('express');
const app = express();

const db = require('./db')

    //console.log('Connected to the database as ID ' + connection.threadId);
    prompt_questions();


function prompt_questions() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
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
                    db.end();
                    console.log("Done");
                    break;
            }
        })
}
// Viewing all employees

function viewAllEmployees() {
    const query = "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.roles_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        prompt_questions();
    });
}

//function to view the departments from the table
function viewAllDepartments() {
    inquirer
        .then(answer => {
            db.findAllDepartments([answer]) 
                .then(() => console.log(`Added ${answer.name} to the database`))
                .then(() => prompt_questions())
        })};

function viewAllRoles() {
    const query = "SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id";

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        prompt_questions();
    });
}


//Add a dapartment
function addAdepartment() {
    inquirer
    .prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
        .then(answer => {
            db.createDepartment([answer]) 
                .then(() => console.log(`Added ${answer.name} to the database`))
                .then(() => prompt_questions())
        })
}

//Add a role
function addArole() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: 'title',
                    message: "What is the name of the role?"
                },
                {
                    name: "salary",
                    message: "How much does the role make?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department will this role be in?",
                    choices: departmentChoices
                }
            ])
                .then(role => {
                    db.createRole(role)
                        .then(() => console.log(`Added ${role.title} to the database`))
                        .then(() => prompt_questions())
                })
        })

}

//Add an Employee

function addAnEmployee() {
    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
        .then(res => {
            let firstName = res.first_name;
            let lastName = res.last_name;

            db.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));
                    prompt({
                        type: "list",
                        name: "roleId",
                        message: "What is the employee's role?",
                        choices: roleChoices
                    })
                        .then(res => {
                            let roleId = res.roleId;

                            db.findAllEmployees()
                                .then(([rows]) => {
                                    let employees = rows;
                                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }));

                                    managerChoices.unshift({ name: "None", value: null });

                                    prompt({
                                        type: "list",
                                        name: "managerId",
                                        message: "Who is the employee's manager?",
                                        choices: managerChoices
                                    })
                                        .then(res => {
                                            let employee = {
                                                manager_id: res.managerId,
                                                role_id: roleId,
                                                first_name: firstName,
                                                last_name: lastName
                                            }

                                            db.createEmployee(employee);
                                        })
                                        .then(() => console.log(
                                            `Added ${firstName} ${lastName} to the database`
                                        ))
                                        .then(() => loadMainPrompts())
                                })
                        })
                })
        })
}

//update an employee role
function updateAnEmployeeRole() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) =>
                ({ name: `${first_name} ${last_name}`, value: id }));

            prompt([
                {
                    type: 'list',
                    name: "employeeId",
                    message: `Which employee's role would you like to change?`,
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;
                    db.viewAllRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const roleChoices = roles.map(({ id, title }) => ({
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

