#!/usr/bin/env node

const { spawn } = require('child_process');

// Test suite for validation (is*) operations
const tests = [
    {
        name: "isNumber with valid number",
        input: "123",
        chain: ".isNumber()",
        expected: "123"  // Should pass through (true condition)
    },
    {
        name: "isNumber with invalid number",
        input: "abc",
        chain: ".isNumber()",
        expected: null  // Should not pass (false condition)
    },
    {
        name: "isInteger with integer",
        input: "123",
        chain: ".isInteger()",
        expected: "123"  // Should pass through (true condition)
    },
    {
        name: "isDate with valid date",
        input: "2023-12-25",
        chain: ".isDate()",
        expected: "2023-12-25"  // Should pass through (true condition)
    },
    {
        name: "isFile with existing file",
        input: "../package.json",
        chain: ".isFile()",
        expected: "../package.json"  // Should pass through (true condition)
    },
    {
        name: "isDirectory with existing directory",
        input: ".",
        chain: ".isDirectory()",
        expected: "."  // Should pass through (true condition)
    },
    {
        name: "isEmail with valid email",
        input: "test@example.com",
        chain: ".isEmail()",
        expected: "test@example.com"  // Should pass through (true condition)
    },
    {
        name: "isURL with valid URL",
        input: "https://example.com",
        chain: ".isURL()",
        expected: "https://example.com"  // Should pass through (true condition)
    },
    {
        name: "isIP with valid IPv4",
        input: "192.168.1.1",
        chain: ".isIP()",
        expected: "192.168.1.1"  // Should pass through (true condition)
    },
    {
        name: "isFilename with valid filename",
        input: "document.pdf",
        chain: ".isFilename()",
        expected: "document.pdf"  // Should pass through (true condition)
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