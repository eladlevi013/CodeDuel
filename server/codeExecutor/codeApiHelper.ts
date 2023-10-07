import { exec as execCb } from 'child_process';
import { writeFile } from 'fs/promises'; // Using promisified version of fs.
import { promisify } from 'util';

const exec = promisify(execCb);
const MAX_EXECUTION_TIME = 3000;

interface CustomError extends Error {
  killed?: boolean;
  message: string;
}

export async function executeCodeOnServer(language: string, code: string) {
    let command = '';

    if (!language) {
        throw new Error('Language not supported.');
    }
    
    switch (language) {
        case 'python':
            command = `python -c "${code}"`;
            break;
        case 'java':
            const javaFileName = "Main.java";
            await writeFile(javaFileName, code);

            // Compiling the Java code
            try {
                await exec(`javac ${javaFileName}`, { timeout: MAX_EXECUTION_TIME });
            } catch (compileError) {
                const error = compileError as CustomError;

                if (error.killed) {
                    return {
                        stderr: 'Compilation timed out.',
                    }
                }

                return {
                    stderr: `Compilation error: ${error.message}`,
                }
            }

            // If compilation succeeds, execute the Java program
            try {
                const { stdout, stderr } = await exec('java Main', { timeout: MAX_EXECUTION_TIME });

                const memoryUsage = process.memoryUsage();
                const result = {
                    stdout,
                    stderr,
                    memoryUsage
                };


                return result;
            } catch (execError) {
                const error = execError as CustomError;

                if (error.killed) {
                    return {
                        stdout: '',
                        stderr: 'Execution timed out.',
                    }
                }

                return {
                    stdout: '',
                    stderr: `Execution error: ${error.message}`,
                }
            }
    }

    if (language !== 'java') {
        try {
            const { stdout, stderr } = await exec(command, { timeout: MAX_EXECUTION_TIME });

            const memoryUsage = process.memoryUsage();

            return {
                stdout,
                stderr,
                memoryUsage
            };
        } catch (errorRaw) {
            const error = errorRaw as CustomError;

            if (error.killed) {
                return {
                    stdout: '',
                    stderr: 'Execution timed out.',
                }
            }

            return {
                stdout: '',
                stderr: `Execution error: ${error.message}`,
            }
        }
    }
}
