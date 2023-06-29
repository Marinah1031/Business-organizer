SELECT department.name AS department, reviews.review
FROM roles
LEFT JOIN department
ON reviews.roles_id = department.id
ORDER BY department.name;