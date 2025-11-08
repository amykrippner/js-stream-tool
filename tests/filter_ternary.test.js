#!/usr/bin/env node

const { spawn } = require('child_process');

// Test suite for filter operations (boolean and ternary)
const tests = [
    // Boolean operations tests
    {
        name: "Filter with includes",
        input: "hello world",
        chain: ".includes('world')",
        expected: "hello world"  // Should output the original line when true
    },
    {
        name: "Filter that returns false",
        input: "hello world",
        chain: ".includes('missing')",
        expected: null  // Should not output anything when false
    },
    {
        name: "StartsWith filter",
        input: "hello world",
        chain: ".startsWith('hello')",
        expected: "hello world"
    },
    {
        name: "EndsWith filter",
        input: "hello world",
        chain: ".endsWith('world')",
        expected: "hello world"
    },
    
    // Ternary operations tests
    {
        name: "Ternary operator with true condition",
        input: "hello",
        chain: ".includes('h') ? .toUpperCase() : .toLowerCase()",
        expected: "HELLO"
    },
    {
        name: "Ternary operator with false condition",
        input: "hello",
        chain: ".includes('x') ? .toUpperCase() : .toLowerCase()",
        expected: "hello"
    },
    {
        name: "Ternary with complex operations",
        input: "test,file.txt",
        chain: ".includes('.txt') ? .split(',')[1].toUpperCase() : .split(',')[0].toLowerCase()",
        expected: "FILE.TXT"
    },
    {
        name: "Ternary returning null for filter behavior",
        input: "nomatch",
        chain: ".includes('x') ? .toUpperCase() : null",
        expected: null  // Should not output anything when null is returned
    },
    {
        name: "Ternary returning undefined for filter behavior",
        input: "nomatch",
        chain: ".includes('x') ? .toUpperCase() : undefined",
        expected: null  // Should not output anything when undefined is returned
    },
    {
        name: "Boolean false still works for filtering",
        input: "test",
        chain: ".includes('x')",  // Should return false, so no output
        expected: null
    },
    {
        name: "Boolean true still works for filtering",
        input: "test",
        chain: ".includes('t')",  // Should return true, so output original line
        expected: "test"
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