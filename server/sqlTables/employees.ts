const createEmployeesTable: string = `
  CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    department VARCHAR(255),
    salary DECIMAL(10, 2),
    hire_date DATE,
    email VARCHAR(255)
  );

  INSERT OR IGNORE INTO employees 
  VALUES
    (1, 'Alice', 'HR', 60000.00, '2023-01-15', 'alice@mail'),
    (2, 'Bob', 'HR', 55000.00, '2022-11-20', 'bob@mail'),
    (3, 'Charlie', 'Sales', 70000.00, '2023-03-05', 'charlie@mail'),
    (4, 'David', 'Sales', 62000.00, '2022-12-10', 'david@mail'),
    (5, 'Eve', 'IT', 65000.00, '2023-02-28', 'eve@mail'),
    (6, 'Frank', 'IT', 72000.00, '2022-10-15', 'frank@mail'),
    (7, 'Grace', 'IT', 75000.00, '2023-04-10', 'grace@mail'),
    (8, 'Hannah', 'Sales', 67000.00, '2023-05-20', 'hannah@mail'),
    (9, 'Ian', 'IT', 71000.00, '2023-06-12', 'ian@mail'),
    (10, 'Jennifer', 'HR', 58000.00, '2023-07-03', 'jennifer@mail'),
    (11, 'Keith', 'IT', 69000.00, '2023-08-15', 'keith@mail'),
    (12, 'Linda', 'Sales', 63000.00, '2023-09-25', 'linda@mail');
`;

export default createEmployeesTable;
