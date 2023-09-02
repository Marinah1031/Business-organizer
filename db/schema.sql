--This line drops the database named department_db if that exists
DROP DATABASE IF EXISTS department_db;
CREATE DATABASE department_db;
--This line selects the database it wants to use
USE department_db;
--this defines an 'id' column as an integer, which is the primary key for the table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
--Auto_increment attribute means that MySQL will automaticlly assign a unique value to this column 
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    --creates a 'title' column for the role titles
    title VARCHAR(30) NOT NULL,
    --This column stores salary information as a decimal value
    salary DECIMAL NOT NULL,
    --stores the department ID to establish a relationship with the 'department' table. 
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department (id)
    ON DELETE CASCADE
);

--The creation of the employee table. 
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    roles_id INT,
    FOREIGN KEY (roles_id)
    REFERENCES roles (id)
    ON DELETE CASCADE,
    manager_id INT,
    FOREIGN KEY (manager_id)
    REFERENCES employee (id)
    ON DELETE SET NULL
);