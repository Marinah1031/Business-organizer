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
                    updateRoleOfAnEmployee();
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
    db.findAllEmployees()
        .then(data => {
            console.table(data[0]);

        })
        .then(() => prompt_questions());

}

//function to view the departments from the table
function viewAllDepartments() {

    db.findAllDepartments()
        .then((data) => console.table(data[0]))
        .then(() => prompt_questions())
};

function viewAllRoles() {

    db.findAllRoles()
        .then((data) => console.table(data[0]))
        .then(() => prompt_questions())
};



//Add a dapartment
function addAdepartment() {
    inquirer
        .prompt([
            {
                name: "department",
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
            const department_id = rows;
            const departmentChoices = department_id.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            inquirer
                .prompt([
                    {
                        name: 'role',
                        message: "What name does the role have?"
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
                .then(rolesData => {
                    db.createRole(rolesData)
                        .then(() => console.log(`Added ${rolesData.title} to the database`))
                        .then(() => prompt_questions())
                        .catch(error => {
                            console.error(error);
                            console.log("Error adding role to the database.");
                        });
                });
        })
        .catch(error => {
            console.error(error);
            console.log("Error fetching departments from the database.");
        });
}




//Add an Employee

function addAnEmployee() {
    inquirer
    .prompt([
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
            const roles_id = rows;
            const rolesChoices = roles_id.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "roles_id",
                        message: "What is the role of the employee?",
                        choices: rolesChoices
                    }
                ])

                .then(res => {
                    let roles_id = res.roles_id;
      
                    db.findAllEmployees()
                    .then(([rows]) => {
                      let employees = rows;
                      const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                      }));
    
                      managerChoices.unshift({ name: "None", value: null });
                      inquirer
                      .prompt({
                        type: "list",
                        name: "managerId",
                        message: "Who is the employee's manager?",
                        choices: managerChoices
                      })
                        .then(res => {
                          let employee = {
                            manager_id: res.managerId,
                            roles_id: roles_id,
                            first_name: firstName,
                            last_name: lastName
                          }
    
                          db.createNewEmployee(employee);
                        })
                        .then(() => console.log(
                          `Added ${firstName} ${lastName} to the database`
                        ))
                        .then(() => prompt_questions())
                    })
                })
            })
        })
    }


//update an employee role
function updateRoleOfAnEmployee() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employeeId = rows;
            const employeeChoices = employeeId.map(({ id, first_name, last_name }) =>
                ({ name: `${first_name} ${last_name}`, value: id }));
            inquirer
            .prompt([
                {
                    type: 'list',
                    name: "employeeId",
                    message: `Which employee's role would you like to change?`,
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;
                    db.findAllRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const rolesChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));
                            inquirer
                            .prompt([
                                {
                                    type: 'list',
                                    name: "roles_id",
                                    message: `What is the new role of this employee?`,
                                    choices: rolesChoices
                                }
                            ])
                                .then(res => db.updateRoleOfAnEmployee(employeeId, res.roles_id))
                                .then(() => console.log("Updated Employee's role"))
                                .then(() => prompt_questions())
                        })
                })
        })

}



