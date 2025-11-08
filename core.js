const { evaluateChain } = require('./evaluator');

function processLine(line, chain) {
    let currentValue = line;
    let shouldContinue = true;

    try {
        const result = evaluateChain(currentValue, chain, line);

        if (typeof result === 'boolean') {
            if (!result) {
                shouldContinue = false;
            }
            // If true, we output the original line, so currentValue is not changed
        } else if (result === null || result === undefined) {
            // If the result is null or undefined, don't output the line (filter it out)
            shouldContinue = false;
        } else {
            currentValue = result; // The result of the transform becomes the new value
        }
    } catch (e) {
        // --- THIS IS THE SMART ERROR HANDLING ---
        if (e instanceof ReferenceError) {
            // This is the most likely error from a quoting mistake.
            console.error(`\n-- HINT --\nAn error occurred: "${e.message}"\nThis often happens due to incorrect shell quoting.\nMake sure your command chain is wrapped in SINGLE quotes, and any strings inside it are wrapped in DOUBLE quotes.\nExample: js '.includes("some text")'\n`);
        } else {
            // For other errors, show a more generic message.
            console.error(`\nError processing line: "${line}"\n -> Operation failed: ${e.message}\n`);
        }
        // We stop processing completely on the first error to avoid flooding the terminal.
        process.exit(1); 
    }

    if (shouldContinue && currentValue !== undefined && currentValue !== null) {
        if (Array.isArray(currentValue)) {
            currentValue.forEach(item => console.log(item));
        } else {
            console.log(currentValue);
        }
    }
}

module.exports = { processLine };