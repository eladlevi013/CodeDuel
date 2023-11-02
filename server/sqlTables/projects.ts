const createProjectsTable: string = `
  CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    department VARCHAR(255),
    project_lead INT,
    FOREIGN KEY (project_lead) REFERENCES employees(id)
  );

  INSERT OR IGNORE INTO projects 
  VALUES
    (1, 'Project A', '2023-01-15', '2023-05-30', 'IT', 5),
    (2, 'Project B', '2023-02-10', '2023-06-25', 'Sales', 3),
    (3, 'Project C', '2023-03-05', '2023-07-15', 'HR', 1),
    (4, 'Project D', '2023-04-20', '2023-08-10', 'IT', 6),
    (5, 'Project E', '2023-05-15', '2023-09-20', 'Sales', 4),
    (6, 'Project F', '2023-06-30', '2023-10-05', 'IT', 11);
`;

export default createProjectsTable;
