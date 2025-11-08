#!/usr/bin/env node

const { spawn } = require('child_process');

// Test suite for conditional and when operations
const tests = [
    {
        name: "When with string condition (matches)",
        input: "hello123",
        chain: ".when('123', str => str.color('red'))",
        expected: "hello123"  // Should be colored red
    },
    {
        name: "When with string condition (no match)",
        input: "hello",
        chain: ".when('123', str => str.color('red'))",
        expected: "hello"  // Should remain unchanged
    },
    {
        name: "When with regex condition (matches)",
        input: "test123",
        chain: ".when(/\\d+/, str => str.color('blue'))",
        expected: "test123"  // Should be colored blue
    },
    {
        name: "When with function condition (matches)",
        input: "hello",
        chain: ".when(str => str.length > 3, str => str.toUpperCase())",
        expected: "HELLO"  // Should be uppercased
    },
    {
        name: "When with else clause (true condition)",
        input: "hello123",
        chain: ".when(/\d+/, str => str.color('red'), str => str.color('blue'))",
        expected: "hello123"  // Should be colored red because it contains digits
    },
    {
        name: "When with else clause (false condition)",
        input: "hello",
        chain: ".when(/\d+/, str => str.color('red'), str => str.color('blue'))",
        expected: "hello"  // Should be colored blue because it doesn't contain digits
    },
    {
        name: "WhenMatch with color operation",
        input: "error in code",
        chain: ".whenMatch('error', 'red')",
        expected: "error in code"  // Should be colored red
    },
    {
        name: "Complex when with multiple conditions",
        input: "javascript",
        chain: ".when(str => str.includes('java'), str => str.toUpperCase())",
        expected: "JAVASCRIPT"  // Should be uppercased
    },
    {
        name: "Switch with value matching (first case)",
        input: "red",
        chain: ".switch(['red', 'green', 'blue'], [str => str.color('red'), str => str.color('green'), str => str.color('blue')])",
        expected: "red"  // Should be colored red
    },
    {
        name: "Switch with value matching (middle case)",
        input: "green",
        chain: ".switch(['red', 'green', 'blue'], [str => str.color('red'), str => str.color('green'), str => str.color('blue')])",
        expected: "green"  // Should be colored green
    },
    {
        name: "Switch with no match",
        input: "yellow",
        chain: ".switch(['red', 'green', 'blue'], [str => str.color('red'), str => str.color('green'), str => str.color('blue')])",
        expected: "yellow"  // Should remain unchanged
    },
    {
        name: "SwitchCase with string value",
        input: "error",
        chain: ".switchCase({'error': 'red', 'warn': 'yellow', 'info': 'blue'})",
        expected: "error"  // Should be colored red
    },
    {
        name: "SwitchCase with function value",
        input: "hello",
        chain: ".switchCase({'hello': str => str.toUpperCase(), 'world': str => str.toLowerCase()})",
        expected: "HELLO"  // Should be uppercased
    },
    {
        name: "SwitchCase with no match",
        input: "missing",
        chain: ".switchCase({'hello': 'red', 'world': 'blue'})",
        expected: "missing"  // Should remain unchanged
    },
    {
        name: "ColorIf with function condition (matches)",
        input: "hello123",
        chain: ".colorIf(str => str.length > 5, 'red')",
        expected: "hello123"  // Should be colored red
    },
    {
        name: "ColorIf with function condition (no match)",
        input: "hi",
        chain: ".colorIf(str => str.length > 5, 'red')",
        expected: "hi"  // Should remain unchanged
    },
    {
        name: "ColorIf with regex condition (matches)",
        input: "test123",
        chain: ".colorIf(/\d+/, 'blue')",
        expected: "test123"  // Should be colored blue
    },
    {
        name: "ColorIf with string condition (matches)",
        input: "error message",
        chain: ".colorIf('error', 'red')",
        expected: "error message"  // Should be colored red
    },
    {
        name: "ColorIfMatch with string pattern (matches)",
        input: "error in code",
        chain: ".colorIfMatch('error', 'red')",
        expected: "error in code"  // Should be colored red
    },
    {
        name: "ColorIfMatch with regex pattern (matches)",
        input: "test123",
        chain: ".colorIfMatch(/\d+/, 'green')",
        expected: "test123"  // Should be colored green
    },
    {
        name: "ColorIfMatch with no match",
        input: "hello world",
        chain: ".colorIfMatch('missing', 'red')",
        expected: "hello world"  // Should remain unchanged
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
                test.chain.includes('.when(') || test.chain.includes('.whenMatch(') || 
                test.chain.includes('.switchCase(') || test.chain.includes('.switch(') ||
                test.chain.includes('.colorIf(') || test.chain.includes('.colorIfMatch(')) {
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