"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCodeOnServer = void 0;
const child_process_1 = require("child_process");
const promises_1 = require("fs/promises"); // Using promisified version of fs.
const util_1 = require("util");
const exec = (0, util_1.promisify)(child_process_1.exec);
const MAX_EXECUTION_TIME = 3000;
function executeCodeOnServer(language, code) {
    return __awaiter(this, void 0, void 0, function* () {
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
                yield (0, promises_1.writeFile)(javaFileName, code);
                // Compiling the Java code
                try {
                    yield exec(`javac ${javaFileName}`, { timeout: MAX_EXECUTION_TIME });
                }
                catch (compileError) {
                    const error = compileError;
                    if (error.killed) {
                        return {
                            stderr: 'Compilation timed out.',
                        };
                    }
                    return {
                        stderr: `Compilation error: ${error.message}`,
                    };
                }
                // If compilation succeeds, execute the Java program
                try {
                    const { stdout, stderr } = yield exec('java Main', { timeout: MAX_EXECUTION_TIME });
                    const memoryUsage = process.memoryUsage();
                    const result = {
                        stdout,
                        stderr,
                        memoryUsage
                    };
                    return result;
                }
                catch (execError) {
                    const error = execError;
                    if (error.killed) {
                        return {
                            stdout: '',
                            stderr: 'Execution timed out.',
                        };
                    }
                    return {
                        stdout: '',
                        stderr: `Execution error: ${error.message}`,
                    };
                }
        }
        if (language !== 'java') {
            try {
                const { stdout, stderr } = yield exec(command, { timeout: MAX_EXECUTION_TIME });
                const memoryUsage = process.memoryUsage();
                return {
                    stdout,
                    stderr,
                    memoryUsage
                };
            }
            catch (errorRaw) {
                const error = errorRaw;
                if (error.killed) {
                    return {
                        stdout: '',
                        stderr: 'Execution timed out.',
                    };
                }
                return {
                    stdout: '',
                    stderr: `Execution error: ${error.message}`,
                };
            }
        }
    });
}
exports.executeCodeOnServer = executeCodeOnServer;
