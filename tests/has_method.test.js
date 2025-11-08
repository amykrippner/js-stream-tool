#!/usr/bin/env node

const { spawn } = require('child_process');

// Test suite for .has() method
const tests = [
    {
        name: "Has method with matching pattern (string)",
        input: "hello world",
        chain: '.has("world")',
        expected: "hello world"  // Should return original string when pattern matches
    },
    {
        name: "Has method with non-matching pattern (string)",
        input: "hello world",
        chain: '.has("test")',
        expected: ""  // Should return empty (null gets filtered) when pattern doesn't match
    },
    {
        name: "Has method with matching pattern (regex)",
        input: "hello world",
        chain: '.has(/wor.d/)',
        expected: "hello world"  // Should return original string when pattern matches
    },
    {
        name: "Has method with non-matching pattern (regex)",
        input: "hello world",
        chain: '.has(/test/)',
        expected: ""  // Should return empty (null gets filtered) when pattern doesn't match
    },
    {
        name: "Has method with empty string pattern",
        input: "hello world",
        chain: '.has("")',
        expected: "hello world"  // Empty string should match (as it's contained in any string)
    },
    {
        name: "Has method allowing safe chaining when pattern matches",
        input: "hello world",
        chain: '.has("hello").toUpperCase()',
        expected: "HELLO WORLD"  // Should allow chaining when pattern matches
    },
    {
        name: "Has method failing with chaining when pattern doesn't match (expected error - now filtered)",
        input: "hello world",
        chain: '.has("xyz").toUpperCase()',
        expected: ""  // Should get filtered because .has returns null, causing error that filters the line
    },
    {
        name: "Original issue - has with direct chaining now works without error (line gets filtered)",
        input: "total 600",
        chain: '.has("root").split(" ").pop()',
        expected: "" // Should not cause error, but gets filtered out since .has returns null
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
            if (error && !test.expected && test.chain.includes(': null')) {
                // This is expected for tests with null (filtering behavior)
                // If we get an error for these cases, it might be the expected outcome
                console.log(`✅ ${test.name}: PASS (filtered - no output as expected)`);
                resolve(true);
                return;
            } else if (error) {
                console.log(`❌ ${test.name}: Error occurred - ${error.trim()}`);
                resolve(false);
                return;
            }

            // Clean the output (remove trailing newlines)
            const actualOutput = output.trim();
            const expectedOutput = test.expected ? test.expected : '';
            
            if (expectedOutput === "") {
                // For tests expecting no output (filtering)
                if (output.trim() === "") {
                    console.log(`✅ ${test.name}: PASS (filtered - no output)`);
                    resolve(true);
                } else {
                    console.log(`❌ ${test.name}: FAIL`);
                    console.log(`   Expected: (no output)`);
                    console.log(`   Actual:   "${actualOutput}"`);
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