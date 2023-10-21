import { exec as execCb } from 'child_process';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import { tmpdir } from 'os';
import { join } from 'path';

const MAX_EXECUTION_TIME = 3000;
const FILE_NAMES = {
  python: 'main.py',
  java: 'Main.java'
};

interface ExecutionError extends Error {
  killed?: boolean;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
}

const exec = promisify(execCb);

async function executePython(code: string): Promise<ExecutionResult> {
  const filePath = join(tmpdir(), FILE_NAMES.python);
  await writeFile(filePath, code);
  return executeCommand(`python "${filePath}"`);
}

async function executeJava(code: string): Promise<ExecutionResult> {
  const fileName = FILE_NAMES.java;
  await writeFile(fileName, code);

  try {
    await exec(`javac ${fileName}`, { timeout: MAX_EXECUTION_TIME });
    return executeCommand('java Main');
  } catch (compileError) {
    return formatError(compileError, 'Compilation');
  }
}

function formatError(errorRaw: any, phase: string): ExecutionResult {
  const error = errorRaw as ExecutionError;

  if (error.killed) {
    return { stdout: '', stderr: `${phase} timed out.` };
  }

  return { stdout: '', stderr: `${phase} error: ${error.message}` };
}

async function executeCommand(command: string): Promise<ExecutionResult> {
  try {
    const { stdout, stderr } = await exec(command, { timeout: MAX_EXECUTION_TIME });
    return { stdout, stderr };
  } catch (errorRaw) {
    return formatError(errorRaw, 'Execution');
  }
}

export async function executeCode(language: string, code: string): Promise<ExecutionResult> {
  switch (language) {
    case 'python':
      return executePython(code);
    case 'java':
      return executeJava(code);
    default:
      throw new Error('Language not supported.');
  }
}
