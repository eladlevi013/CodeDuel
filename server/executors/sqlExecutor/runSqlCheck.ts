import { sqlQuestions } from '../../db/sqlQuestions';
import sqlite3 from 'sqlite3';
import createEmployeesTable from '../../sqlTables/employees';
import createProjectsTable from '../../sqlTables/projects';

// global variables
const db = new sqlite3.Database(`test.sqlite`);

// tables creation queries dictionary
const tablesCreationQuery: Record<string, string> = {
  employees: createEmployeesTable,
  projects: createProjectsTable
};

// Wrap the database operations in a Promise
const executeQuery = (db: sqlite3.Database, query: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!query || typeof query !== 'string') {
      reject(new Error('Invalid or empty query'));
      return;
    }

    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const initTableDependencies = async (tables: string[]) => {
  for (const table of tables) {
    const tableCreationQuery = tablesCreationQuery[table];

    // Wrap table creation in a Promise
    await new Promise<void>((resolve, reject) => {
      db.exec(tableCreationQuery, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};

export const runSqlCheck = async (questionId: string, sqlQuery: string) => {
  const result = { stdout: true, stderr: null as string | null };
  const question = sqlQuestions[parseInt(questionId) - 1];
  const answerQuery = question.sqlQuery(false);
  const orderMatters = question.orderMatters;

  try {
    // Initialize table dependencies
    await initTableDependencies(Object.keys(question.tables));

    // Fetch user's query result
    let userAnswer: Object[] = [];
    await executeQuery(db, sqlQuery)
      .then(rows => {
        userAnswer = rows;
      })
      .catch(err => {
        result.stderr = err.message;
        return result;
      });

    // Fetch correct answer
    let answer: Object[] = [];
    await executeQuery(db, answerQuery)
      .then(rows => {
        answer = rows;
      })
      .catch(err => {
        result.stderr = err.message;
        return result;
      });

    const answerEquals = compareAnswers(answer as Object[], userAnswer as Object[], orderMatters);
    result.stdout = answerEquals;
  } catch (err: any) {
    result.stdout = false;
    result.stderr = err.message;
  } finally {
    question.example = result;
    return result;
  }
};

export const getTablePreview = async (tableName: string) => {
  // Installing table dependencies
  await initTableDependencies([tableName]);

  // Getting Result
  const result = await executeQuery(db, `SELECT * FROM ${tableName} LIMIT 5;`);

  // when table is empty
  if (result.length === 0) {
    return { titles: [], values: [] };
  }

  // Convert result to table object
  const titles = Object.keys(result[0]);
  const values = result.map(row => Object.values(row));
  const table = { titles, values };

  return table;
};

export const getExampleAnswer = async (questionId: string) => {
  const question = sqlQuestions[parseInt(questionId) - 1];

  // Installing table dependencies
  await initTableDependencies(Object.keys(question.tables));

  // Getting Result
  const query = question.sqlQuery(true);
  const result = (await executeQuery(db, query)).slice(0, 6);

  // when table is empty
  if (result.length === 0) {
    return { titles: [], values: [] };
  }

  // Convert result to table object
  const titles = Object.keys(result[0]);
  const values = result.map(row => Object.values(row));
  const table = { titles, values };

  return table;
};

const compareAnswers = (answer: Object[], user: Object[], orderMatters: boolean) => {
  if (orderMatters) {
    if (answer.length !== user.length) {
      return false;
    }

    for (let i = 0; i < answer.length; i++) {
      if (!objectsAreEqual(answer[i], user[i])) {
        return false;
      }
    }

    return true;
  } else {
    const answerSet = new Set(answer);
    const userSet = new Set(user);

    if (answerSet.size !== userSet.size) {
      return false;
    }

    for (const element of answerSet) {
      if (!setHasEqualObject(userSet, element)) {
        return false;
      }
    }

    return true;
  }
};

function objectsAreEqual(obj1: Object, obj2: Object) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function setHasEqualObject(set: Set<Object>, obj: Object) {
  for (const item of set) {
    if (objectsAreEqual(item, obj)) {
      return true;
    }
  }
  return false;
}
