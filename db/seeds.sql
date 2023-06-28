INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Engineering"),
       ("Finance"),
       ("Finance"),
       ("Legal"),
       ("Legal");

INSERT INTO roles (department_id, title, salary)
VALUES (1, "Salesperson", 80000),
       (2, "Lead Engineer", 150000),
       (1, "Software Engineer", 120000),
       (3, "Account Manager", 160000),
       (5, "Accountant", 125000),
       (1, "Legal Team Lead", 250000),
       (5, "Lawer", 190000);
       