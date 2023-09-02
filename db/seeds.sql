use department_db;
--values of department
INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");
--title, salary and department id inside the roles
INSERT INTO roles (title, salary, department_id)
VALUES ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);
--inside employee, first and last name, role id, and manager id. Null if they are manager
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Abigail", "Adams", 2, NULL),
       ("George", "Washington", 3, 1),
       ("Benjamin", "Franklin", 1, NULL),
       ("Albert", "Einstein", 4, NULL),
       ("Bob", "Ross", 5, 4),
       ("Taylor", "Swift", 6, NULL),
       ("Selena", "Gomez", 7, 6);
       