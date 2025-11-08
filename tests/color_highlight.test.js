#!/usr/bin/env node

const { spawn } = require('child_process');

// Test suite for color and highlight operations
const tests = [
    // Color function tests
    {
        name: "Color red",
        input: "test",
        chain: ".color('red')",
        expected: "\x1b[31mtest\x1b[0m"
    },
    {
        name: "Color green",
        input: "test",
        chain: ".color('green')",
        expected: "\x1b[32mtest\x1b[0m"
    },
    {
        name: "Color with transformation",
        input: "hello",
        chain: ".toUpperCase().color('blue')",
        expected: "\x1b[34mHELLO\x1b[0m"
    },
    {
        name: "Background color",
        input: "test",
        chain: ".color('bgYellow').color('black')",
        expected: "\x1b[43m\x1b[30mtest\x1b[0m"
    },
    {
        name: "Invalid color (should default to reset)",
        input: "test",
        chain: ".color('invalidColor')",
        expected: "test"
    },
    
    // Highlight function tests
    {
        name: "Highlight single string",
        input: "This is a test string with test words",
        chain: ".highlight('test', 'red')",
        expected: "This is a test string with test words"  // with 'test' parts in red
    },
    {
        name: "Highlight array of strings",
        input: "apple banana cherry apple",
        chain: ".highlight(['apple', 'cherry'], 'green')",
        expected: "apple banana cherry apple"  // with 'apple' and 'cherry' parts in green
    },
    {
        name: "Highlight regex pattern",
        input: "Date: 2023-12-25 and 2024-01-01",
        chain: ".highlightRegex(/\\d{4}-\\d{2}-\\d{2}/, 'blue')",
        expected: "Date: 2023-12-25 and 2024-01-01"  // with dates in blue
    },
    {
        name: "Highlight filenames",
        input: "Open file.txt and document.pdf for more info",
        chain: ".highlightFilenames('blue')",
        expected: "Open file.txt and document.pdf for more info"  // with filenames in blue
    },
    {
        name: "Highlight dates",
        input: "Event on 2023-05-20 and meeting 12/25/2023",
        chain: ".highlightDates('green')",
        expected: "Event on 2023-05-20 and meeting 12/25/2023"  // with dates in green
    },
    {
        name: "Highlight numbers",
        input: "I have 123 apples and 45.67 oranges",
        chain: ".highlightNumbers('yellow')",
        expected: "I have 123 apples and 45.67 oranges"  // with numbers in yellow
    },
    {
        name: "Highlight any with defaults",
        input: "file.txt from 2023-12-25 with 123MB",
        chain: ".highlightAny()",
        expected: "file.txt from 2023-12-25 with 123MB"  // with all types highlighted in defaults
    },
    {
        name: "Highlight any excluding types",
        input: "file.txt from 2023-12-25 with 123MB",
        chain: ".highlightAny(['dates'])",
        expected: "file.txt from 2023-12-25 with 123MB"  // highlights all except dates
    }
];

module.exports = { tests, runTest };

function runTest(test) {
    return new Promise((resolve, reject) => {
        const child = spawn('echo', [test.input]);
        const jsProcess = spawn('node', ['../js.js', test.chain], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: __dirname
        });

        let output = '';
        let error = '';

        // Pipe echo output to js.js
        child.stdout.pipe(jsProcess.stdin);

        jsProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        jsProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        jsProcess.on('close', (code) => {
            if (error) {
                console.log(`❌ ${test.name}: Error occurred - ${error.trim()}`);
                resolve(false);
                return;
            }

            // Clean the output (remove trailing newlines)
            const actualOutput = output.trim();
            const expectedOutput = test.expected ? test.expected : '';
            
            // For tests with color codes, we'll check if the plain text content matches
            if (test.chain.includes('color(') || test.chain.includes('.color(') || 
                test.chain.includes('.highlight(') || test.chain.includes('.highlightRegex(') ||
                test.chain.includes('.highlightFilenames(') || test.chain.includes('.highlightDates(') ||
                test.chain.includes('.highlightNumbers(') || test.chain.includes('.highlightAny(') ||
                test.chain.includes('.whenMatch(')) {
                // Remove ANSI color codes for comparison if needed
                const ansiRegex = /\x1b\[[0-9;]*m/g;
                const actualWithoutAnsi = actualOutput.replace(ansiRegex, '');
                const expectedWithoutAnsi = expectedOutput.replace(ansiRegex, '');
                
                if (actualWithoutAnsi === expectedWithoutAnsi) {
                    console.log(`✅ ${test.name}: PASS`);
                    resolve(true);
                } else {
                    console.log(`❌ ${test.name}: FAIL`);
                    console.log(`   Expected: "${expectedWithoutAnsi}"`);
                    console.log(`   Actual:   "${actualWithoutAnsi}"`);
                    resolve(false);
                }
            } else {
                if (actualOutput === expectedOutput) {
                    console.log(`✅ ${test.name}: PASS`);
                    resolve(true);
                } else {
                    console.log(`❌ ${test.name}: FAIL`);
                    console.log(`   Expected: "${expectedOutput}"`);
                    console.log(`   Actual:   "${actualOutput}"`);
                    resolve(false);
                }
            }
        });

        child.on('error', (err) => {
            console.log(`❌ ${test.name}: Spawn error - ${err.message}`);
            reject(err);
        });

        jsProcess.on('error', (err) => {
            console.log(`❌ ${test.name}: Process error - ${err.message}`);
            reject(err);
        });
    });
}