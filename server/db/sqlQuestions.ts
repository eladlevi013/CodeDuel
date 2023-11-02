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
  },
  {
    id: '9',
    title: 'List Projects and Their Leads',
    description:
      'Write an SQL query to list the projects along with the names of the project leads (employees). Sort the result by project name in ascending order.',
    tables: { projects: {}, employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
      SELECT p.name AS project_name, e.name AS project_lead_name
      FROM (SELECT * FROM projects ${preview ? 'LIMIT 5' : ''}) p
      JOIN (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''}) e ON p.project_lead = e.id
      ORDER BY project_name;
    `;
    },
    orderMatters: true,
    difficulty: 1,
    categories: ['Joining Tables']
  },
  {
    id: '10',
    title: 'Count Projects by Department',
    description:
      'Write an SQL query to count the number of projects in each department. Sort the result by department name in ascending order.',
    tables: { projects: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
      SELECT department, COUNT(*) AS project_count
      FROM (SELECT * FROM projects ${preview ? 'LIMIT 5' : ''})
      GROUP BY department
      ORDER BY department;
    `;
    },
    orderMatters: false,
    difficulty: 1,
    categories: ['Aggregation', 'Joining Tables']
  },
  {
    id: '11',
    title: 'Project with Highest Expenses',
    description:
      'Write an SQL query to find the project with the highest total salary expenses (sum of employee salaries) within the project. Display the project name and total expenses. Sort the result by total expenses in descending order.',
    tables: { projects: {}, employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
      SELECT p.name AS project_name, SUM(e.salary) AS total_expenses
      FROM (SELECT * FROM projects ${preview ? 'LIMIT 5' : ''}) p
      JOIN (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''}) e ON p.project_lead = e.id
      GROUP BY project_name
      ORDER BY total_expenses DESC;
    `;
    },
    orderMatters: false,
    difficulty: 2,
    categories: ['Aggregation', 'Joining Tables']
  },
  {
    id: '12',
    title: 'List Employees and Their Project Assignments',
    description:
      'Write an SQL query to list the names of employees and the projects they are assigned to. Include employees even if they are not assigned to any project. Sort the result by employee name in ascending order.',
    tables: { projects: {}, employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
      SELECT e.name AS employee_name, p.name AS project_name
      FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''}) e
      LEFT JOIN (SELECT * FROM projects ${preview ? 'LIMIT 5' : ''}) p ON e.id = p.project_lead
      ORDER BY employee_name;
    `;
    },
    orderMatters: true,
    difficulty: 2,
    categories: ['Joining Tables']
  },
  {
    id: '13',
    title: 'Average Salary by Department',
    description:
      'Write an SQL query to calculate the average salary of employees in each department. Sort the result by department name in ascending order.',
    tables: { employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
      SELECT department, AVG(salary) AS average_salary
      FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''})
      GROUP BY department
      ORDER BY department;
    `;
    },
    orderMatters: false,
    difficulty: 2,
    categories: ['Aggregation', 'Joining Tables']
  },
  {
    id: '14',
    title: 'List Employees in IT Department with Project Assignments',
    description:
      'Write an SQL query to list the names of employees in the IT department along with the projects they are assigned to. Sort the result by employee name in ascending order.',
    tables: { projects: {}, employees: {} },
    example: {},
    sqlQuery: (preview: boolean) => {
      return `
      SELECT e.name AS employee_name, p.name AS project_name
      FROM (SELECT * FROM employees ${preview ? 'LIMIT 5' : ''}) e
      LEFT JOIN (SELECT * FROM projects ${preview ? 'LIMIT 5' : ''}) p ON e.id = p.project_lead
      WHERE e.department = 'IT'
      ORDER BY employee_name;
    `;
    },
    orderMatters: false,
    difficulty: 2,
    categories: ['Joining Tables']
  }
];
