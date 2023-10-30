export const sqlQuestions = [
  {
    id: '1',
    title: 'Highest Salary in Each Department',
    description:
      'Write an SQL query to find the highest salary in each department. Sort the result in ascending order by salary.',
    example: 'Find the highest salary in each department, sorted by salary in ascending order.',
    sqlQuery: `
        SELECT department, MAX(salary) AS max_salary
        FROM employees
        GROUP BY department
        ORDER BY max_salary;
      `,
    orderMatters: true,
    difficulty: 2,
    categories: ['Aggregation']
  },
  {
    id: '2',
    title: 'Employees in IT Department',
    description:
      'Write an SQL query to retrieve the names of all employees in the IT department. Sort the result in ascending order by name.',
    example:
      'Retrieve the names of employees in the IT department, sorted by name in ascending order.',
    sqlQuery: `
        SELECT name
        FROM employees
        WHERE department = 'IT'
        ORDER BY name;
      `,
    orderMatters: true,
    difficulty: 1,
    categories: ['Basic Query']
  },
  {
    id: '3',
    title: 'Total Salary Expenses',
    description: 'Write an SQL query to calculate the total salary expenses of the company.',
    example: 'Calculate the total salary expenses of the company.',
    sqlQuery: `
        SELECT SUM(salary) AS total_salary_expense
        FROM employees;
      `,
    orderMatters: false,
    difficulty: 1,
    categories: ['Aggregation']
  },
  {
    id: '4',
    title: 'Youngest Employee',
    description: 'Write an SQL query to find the youngest employee in the company.',
    example: 'Find the youngest employee in the company.',
    sqlQuery: `
        SELECT name, MIN(hire_date) AS hire_date
        FROM employees;
      `,
    orderMatters: false,
    difficulty: 1,
    categories: ['Aggregation']
  },
  {
    id: '5',
    title: 'Average Salary by Department',
    description: 'Write an SQL query to calculate the average salary in each department.',
    example: 'Calculate the average salary in each department.',
    sqlQuery: `
        SELECT department, AVG(salary) AS avg_salary
        FROM employees
        GROUP BY department;
      `,
    orderMatters: false,
    difficulty: 2,
    categories: ['Aggregation', 'Group By']
  },
  {
    id: '6',
    title: 'Number of Employees in Each Department',
    description: 'Write an SQL query to count the number of employees in each department.',
    example: 'Count the number of employees in each department.',
    sqlQuery: `
        SELECT department, COUNT(*) AS employee_count
        FROM employees
        GROUP BY department;
      `,
    orderMatters: false,
    difficulty: 2,
    categories: ['Aggregation', 'Group By']
  },
  {
    id: '7',
    title: 'Department with the Most Employees',
    description: 'Write an SQL query to find the department with the most employees.',
    example: 'Find the department with the most employees.',
    sqlQuery: `
        SELECT department
        FROM employees
        GROUP BY department
        HAVING COUNT(*) = (
          SELECT MAX(employee_count)
          FROM (SELECT department, COUNT(*) AS employee_count FROM employees GROUP BY department)
        );
      `,
    orderMatters: false,
    difficulty: 3,
    categories: ['Aggregation', 'Group By', 'Subquery']
  },
  {
    id: '8',
    title: 'Employees with Higher Salaries',
    description:
      'Write an SQL query to retrieve employees with salaries greater than the average salary.',
    example: 'Retrieve employees with salaries greater than the average salary.',
    sqlQuery: `
        SELECT name, salary
        FROM employees
        WHERE salary > (SELECT AVG(salary) FROM employees);
      `,
    orderMatters: false,
    difficulty: 3,
    categories: ['Subquery']
  },
  {
    id: '9',
    title: 'Monthly Salary Growth',
    description:
      'Write an SQL query to calculate the monthly salary growth for each employee (current salary minus initial salary).',
    example: 'Calculate the monthly salary growth for each employee.',
    sqlQuery: `
        SELECT name, (salary - initial_salary) AS monthly_salary_growth
        FROM (
          SELECT e.name, e.salary, e.hire_date,
                 (SELECT salary FROM employees WHERE employee_id = e.employee_id) AS initial_salary
          FROM employees e
        ) AS employee_salary;
      `,
    orderMatters: false,
    difficulty: 4,
    categories: ['Subquery', 'Advanced Calculation']
  },
  {
    id: '10',
    title: 'Managers with Highest Salary Difference',
    description:
      'Write an SQL query to find the managers whose salary difference from their direct reports is the highest.',
    example: 'Find the managers with the highest salary difference from direct reports.',
    sqlQuery: `
        SELECT m.name AS manager_name, (m.salary - AVG(r.salary)) AS salary_difference
        FROM employees m
        INNER JOIN employees r ON m.employee_id = r.manager_id
        GROUP BY m.name
        HAVING salary_difference = (
          SELECT MAX(salary_difference) 
          FROM (
            SELECT m.name AS manager_name, (m.salary - AVG(r.salary)) AS salary_difference
            FROM employees m
            INNER JOIN employees r ON m.employee_id = r.manager_id
            GROUP BY m.name
          )
        );
      `,
    orderMatters: false,
    difficulty: 4,
    categories: ['Join', 'Subquery', 'Advanced Calculation']
  }
];
