const inquirer = require('inquirer');
const express = require('express');
const app = express();

const db = require('./db')

//console.log('Connected to the database as ID ' + connection.threadId);
prompt_questions();

//a list of questions using the inquirer with ability to choose what action to take
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
// part of a promise chain that recieves the answer paramter 
        .then((answer) => {
            //the switch statement checks the value of answer.action, that represents the users selected action from the menu
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
            const department_id = rows;
            const departmentChoices = department_id.map(({ id, name }) => ({
                name: name,
                value: id
            }));
//using the inquirer.prompt to diplay an array of questions to answer in order to add a new role into the system.
            inquirer
                .prompt([
                    {
                        name: 'title',
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

        //catches errors it may come across when trying to fetch departments from the database
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

async function updateRoleOfAnEmployee() {
    try {
        const [employeeRows] = await db.findAllEmployees();
        const employeeChoices = employeeRows.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const {employeeId} = await inquirer.prompt([
            {
                type:"list" ,  // list of questions for user input
                name:'employeeId',
                message : 'Which Employee would you like to change?',
                choices: employeeChoices
                }
        ]);
        const [rolesRow ]=await db.findAllRoles();  
        const rolesChoices = rolesRow.map(({ id, title }) => ({
            name: `${title} ${id}`,
            value: id
        }));

        const {roles_id} = await inquirer.prompt ([
            {
                type:'list',
                name: "roles_id",
                message :"What is their new Role?",
                choices: rolesChoices
            }
        ]);

        await db.updateRoleOfAnEmployee(employeeId, roles_id);
        console.log("Role Updated");
        await prompt_questions();
    } catch (error) {
        console.log(error);
        console.log("Error fetching or updating data from the database");
    }
    }
    




  