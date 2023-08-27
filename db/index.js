const connection = require("./connection");

class DB {
    constructor(connection) {
        this.connection = connection;
}
// Finding all employees, roles and departements are also there to show roles, salaries, departments, and etc. 
findAllEmployees() {
    return this.connection.promise().query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
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
updateRoleOfAnEmployee(roleId, employeeId) {
    return this.connection.promise().query(
        "UPDATE employee SET role_id=? WHERE id=?", [roleId, employeeId]
    );
    }

    findAllRoles() {
        return this.connection.promise().query(
          "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
      }
    // Create a new role
  createRole(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
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