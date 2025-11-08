#!/usr/bin/env node

const { spawn } = require('child_process');

// Test suite for array operations
const tests = [
    // Array functions tests
    {
        name: "Last element",
        input: "a,b,c",
        chain: ".split(',').last()",
        expected: "c"
    },
    {
        name: "First element",
        input: "a,b,c",
        chain: ".split(',').first()",
        expected: "a"
    },
    {
        name: "Get element at index",
        input: "a,b,c",
        chain: ".split(',').get(1)",
        expected: "b"
    },
    {
        name: "Compact array",
        input: ",a,,b,c,",
        chain: ".split(',').compact().join(',')",
        expected: "a,b,c"
    },
    {
        name: "Array filter operations",
        input: "a,b,c,d,e",
        chain: ".split(',').filter(item => item !== 'c').join(',')",
        expected: "a,b,d,e"
    },
    {
        name: "Array map operations",
        input: "a,b,c",
        chain: ".split(',').map(item => item.toUpperCase()).join(',')",
        expected: "A,B,C"
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