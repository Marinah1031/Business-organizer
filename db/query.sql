-- the part of the query select two columns
SELECT department.name AS department, reviews.review
FROM 
-- retrieves all rows from the left table and matching rows from the right table based on the specified conditions
LEFT JOIN department
ON reviews.roles_id = department.id
-- orders the result set by the 'department.name' column in ascending order.
ORDER BY department.name;