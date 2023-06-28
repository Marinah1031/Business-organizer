SELECT department.name AS department, roles.salary
FROM roles
LEFT JOIN department
ON roles_id = department.id
ORDER BY department.name;