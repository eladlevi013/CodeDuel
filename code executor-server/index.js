const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_EXECUTION_TIME = 3000;

app.use(express.json());

app.post('/execute', (req, res) => {
    const { language, code } = req.body;

    let command = '';

    switch (language) {
        case 'python':
            command = `python -c "${code}"`;
            break;
        case 'java':
            const javaFileName = "Main.java";
            fs.writeFileSync(javaFileName, code);

            // Compiling the Java code
            exec(`javac ${javaFileName}`, { timeout: MAX_EXECUTION_TIME }, (compileError) => {
                if (compileError) {
                    if (compileError.killed) {
                        return res.status(500).send('Compilation timed out.');
                    }
                    return res.status(500).send(`Compilation error: ${compileError.message}`);
                }

                // If compilation succeeds, execute the Java program
                exec('java Main', { timeout: MAX_EXECUTION_TIME }, (execError, stdout, stderr) => {
                    if (execError) {
                        if (execError.killed) {
                            return res.status(500).send('Execution timed out.');
                        }
                        return res.status(500).send(`Execution error: ${execError.message}`);
                    }

                    // Get memory usage
                    const memoryUsage = process.memoryUsage();

                    return res.json({
                        stdout: stdout,
                        stderr: stderr,
                        memoryUsage: memoryUsage
                    });
                });
            });
            return;
        default:
            return res.status(400).send('Language not supported.');
    }

    if (language !== 'java') {
        exec(command, { timeout: MAX_EXECUTION_TIME }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    return res.status(500).send('Execution timed out.');
                }
                return res.status(500).send(`Execution error: ${error.message}`);
            }

            // Get memory usage
            const memoryUsage = process.memoryUsage();

            return res.json({
                stdout: stdout,
                stderr: stderr,
                memoryUsage: memoryUsage
            });
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
