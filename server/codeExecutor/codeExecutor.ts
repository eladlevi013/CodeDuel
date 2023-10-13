import { exec as execCb } from 'child_process';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import { tmpdir } from 'os';  // Import the required module
import { join } from 'path';

const exec = promisify(execCb);

// Constants
const MAX_EXECUTION_TIME = 3000;
const JAVA_FILE_NAME = "Main.java";

// Custom error type
interface CustomError extends Error {
  killed?: boolean;
  message: string;
}

// Response structure
interface ExecutionResult {
  stdout: string;
  stderr: string;
  memoryUsage?: NodeJS.MemoryUsage;
}

async function executePython(code: string): Promise<ExecutionResult> {
    const tempFilePath = join(tmpdir(), 'temp.py');
    await writeFile(tempFilePath, code);
    return executeCommand(`python "${tempFilePath}"`);
}

async function executeJava(code: string): Promise<ExecutionResult> {
  await writeFile(JAVA_FILE_NAME, code);

  try {
    await exec(`javac ${JAVA_FILE_NAME}`, { timeout: MAX_EXECUTION_TIME });
  } catch (compileError) {
    return handleError(compileError, 'Compilation');
  }

  return executeCommand('java Main');
}

function handleError(errorRaw: any, phase: string): ExecutionResult {
  const error = errorRaw as CustomError;

  if (error.killed) {
    return {
      stdout: '',
      stderr: `${phase} timed out.`,
    };
  }

  return {
    stdout: '',
    stderr: `${phase} error: ${error.message}`,
  };
}

async function executeCommand(command: string): Promise<ExecutionResult> {
  try {
    const { stdout, stderr } = await exec(command, { timeout: MAX_EXECUTION_TIME });
    const memoryUsage = process.memoryUsage();

    return {
      stdout,
      stderr,
      memoryUsage,
    };
  } catch (errorRaw) {
    return handleError(errorRaw, 'Execution');
  }
}

export async function executeCodeOnServer(language: string, code: string): Promise<ExecutionResult> {
  if (!language) {
    throw new Error('Language not provided or not supported.');
  }

  switch (language) {
    case 'python':
      return executePython(code);
    case 'java':
      return executeJava(code);
    default:
      throw new Error('Language not supported.');
  }
}
