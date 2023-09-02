const connection = require("./connection");

class DB {
    constructor(connection) {
        this.connection = connection;
}
// Finding all employees, roles and departements are also there to show roles, salaries, departments, and etc. 
findAllEmployees() {
  const test = this.connection.promise().query('SELECT * FROM employee').then(r => console.log(r))
    const emp =  this.connection.promise().query(
        "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.roles_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
    console.log(emp)
    return (emp)
}
// Finding all the employees without the given employee id.
findAllManagers(employeeId) {
    return this.connection.promise().query(
        "SELECT id, first_name, last_name FROM employee WHERE id != ?",
        employeeId
    );
}

//Creating a new employee
createNewEmployee(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee
    );
}

//Update the employee's role
updateRoleOfAnEmployee(roles_id, employeeId) {
  console.log(roles_id)
    const res = this.connection.promise().query(
        "UPDATE employee SET roles_id=? WHERE id=?", [roles_id, employeeId]
        ).then(r => {
          console.log(r)
          return r
        })
        return res;
    }

//using a database connection that is a property of the curernt object and chaints the promise method 
// to convert the connection to a promise-based connection for asynchronous database queries. 
    findAllRoles() {
        return this.connection.promise().query(
          "SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id;"
        );
      }
    // Create a new role
  createRole(roles) {
    return this.connection.promise().query("INSERT INTO roles SET ?", roles);
  }

    // Find all departments
    findAllDepartments() {
        return this.connection.promise().query(
          "SELECT department.id, department.name FROM department;"
        );
      }
 // Create a new department
 createDepartment(department) {
    return this.connection.promise().query("INSERT INTO department SET ?", department);
  }


}

module.exports = new DB(connection);