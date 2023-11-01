export const sqlQuestions = [
  {
    id: '1',
    title: 'Highest Salary in Each Department',
    description:
      'Write an SQL query to find the highest salary in each department. Sort the result in ascending order by salary.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
      SELECT department, MAX(salary) AS max_salary
      FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''})
      GROUP BY department
      ORDER BY max_salary;
    `;
    },
    orderMatters: true,
    difficulty: 2,
    categories: ['Aggregation']
  },
  {
    id: '2',
    title: 'Employees in IT Department',
    description:
      'Write an SQL query to retrieve the names of all employees in the IT department. Sort the result in ascending order by name.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
        SELECT name
        FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''})
        WHERE department = 'IT'
        ORDER BY name;
      `;
    },
    orderMatters: true,
    difficulty: 1,
    categories: ['Basic Query']
  },
  {
    id: '3',
    title: 'Total Salary Expenses',
    description: 'Write an SQL query to calculate the total salary expenses of the company.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
        SELECT SUM(salary) AS total_salary_expense
        FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''});
      `;
    },
    orderMatters: false,
    difficulty: 1,
    categories: ['Aggregation']
  },
  {
    id: '4',
    title: 'Youngest Employee',
    description: 'Write an SQL query to find the youngest employee in the company.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
        SELECT name, MIN(hire_date) AS hire_date
        FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''});
      `;
    },
    orderMatters: false,
    difficulty: 1,
    categories: ['Aggregation']
  },
  {
    id: '5',
    title: 'Average Salary by Department',
    description: 'Write an SQL query to calculate the average salary in each department.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
        SELECT department, AVG(salary) AS avg_salary
        FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''})
        GROUP BY department;
      `;
    },
    orderMatters: false,
    difficulty: 2,
    categories: ['Aggregation', 'Group By']
  },
  {
    id: '6',
    title: 'Number of Employees in Each Department',
    description: 'Write an SQL query to count the number of employees in each department.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
        SELECT department, COUNT(*) AS employee_count
        FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''})
        GROUP BY department;
      `;
    },
    orderMatters: false,
    difficulty: 2,
    categories: ['Aggregation', 'Group By']
  },
  {
    id: '7',
    title: 'Department with the Most Employees',
    description: 'Write an SQL query to find the department with the most employees.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
        SELECT department
        FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''})
        GROUP BY department
        HAVING COUNT(*) = (
          SELECT MAX(employee_count)
          FROM (SELECT department, COUNT(*) AS employee_count 
          FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''}) 
          GROUP BY department)
        );
      `;
    },
    orderMatters: false,
    difficulty: 3,
    categories: ['Aggregation', 'Group By', 'Subquery']
  },
  {
    id: '8',
    title: 'Employees with Higher Salaries',
    description:
      'Write an SQL query to retrieve employees with salaries greater than the average salary.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
        SELECT name, salary
        FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''})
        WHERE salary > (SELECT AVG(salary) FROM (SELECT * FROM employees ${
          preview ? 'LIMIT 5' : ''
        }));
      `;
    },
    orderMatters: false,
    difficulty: 3,
    categories: ['Subquery']
  }
];
