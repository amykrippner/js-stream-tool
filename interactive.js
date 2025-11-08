#!/usr/bin/env node

const repl = require('repl');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Add our extensions for the REPL
const { addExtensions, colors, color, last, pop, first, compact, get } = require('./extensions');
const { evaluateChain } = require('./evaluator');

// Add extensions to String and Array prototypes
addExtensions();

// Create a simple test data array
let testData = [
    "file1.txt",
    "document.pdf", 
    "image.png",
    "data.json",
    "script.js"
];

// Add REPL-specific helper functions
function help() {
    console.log(`
js-stream-tool Interactive Mode
===============================

Commands:
  .help          - Show this help
  .data          - Show current test data
  .test(str)     - Apply operations to test data (e.g., .test('.toUpperCase()'))
  .add(str)      - Add string to test data
  .clear         - Clear test data
  .sample        - Load sample data
  .exit or .quit - Exit interactive mode

Examples:
  .test('.color("red")')              - Color test data red
  .test('.includes("json")')          - Filter for JSON files
  .test('.split(".").pop()')          - Get file extensions
  .test('.when(str => str.length > 8, str => str.toUpperCase())') - Uppercase longer strings
    `);
}

function test(chain) {
    console.log('Input data:', testData);
    console.log('Applying chain:', chain);
    console.log('Results:');
    
    for (const item of testData) {
        try {
            // Use the same evaluation logic as the main application
            const result = evaluateChain(item, chain);
            console.log('  ', result);
        } catch (e) {
            console.log('  Error:', e.message);
        }
    }
}

function add(str) {
    testData.push(str);
    console.log(`Added "${str}" to test data`);
}

function data() {
    console.log('Current test data:', testData);
}

function clear() {
    testData = [];
    console.log('Test data cleared');
}

function sample() {
    testData = [
        "README.md",
        "package.json",
        "src/index.js", 
        "tests/basic.test.js",
        "docs/guide.md",
        "2023-10-15.log",
        "backup.tar.gz"
    ];
    console.log('Loaded sample data');
}

// Check if data is being piped in
const isPiped = !process.stdin.isTTY;

let alreadyStarted = false;

if (isPiped) {
    console.log('Reading piped input...');
    let inputLines = [];
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    
    rl.on('line', (line) => {
        inputLines.push(line);
        if (inputLines.length >= 3) {
            rl.close();
        }
    });
    
    rl.on('close', () => {
        // Use piped data if available, otherwise use default
        if (inputLines.length > 0) {
            testData = inputLines;
            console.log('(Using piped input as test data)');
        } else {
            console.log('(No piped input received, using default data)');
        }
        if (!alreadyStarted) {
            alreadyStarted = true;
            startRepl();
        }
    });
    
    // Set a timeout in case no data is provided
    setTimeout(() => {
        if (inputLines.length === 0 && !alreadyStarted) {
            console.log('(No piped input received, using default data)');
            alreadyStarted = true;
            startRepl();
        }
    }, 1000);
} else {
    // No piped data, start with default data
    startRepl();
}

function startRepl() {
    console.log('js-stream-tool Interactive Mode');
    console.log('===============================');
    console.log('Type ".help" for available commands');
    console.log('');
    
    // Create REPL server
    const r = repl.start({
        prompt: 'js> ',
        useGlobal: true
    });
    
    // Add custom commands to the REPL context
    r.context.help = help;
    r.context.test = test;
    r.context.add = add;
    r.context.data = data;
    r.context.clear = clear;
    r.context.sample = sample;
    
    // Add a function for testing chains (more flexible than REPL commands)
    r.context.t = r.context.test = test;
    
    // Add a function to run chains similar to js command
    r.context.run = function(chain) {
        console.log('Applying chain:', chain);
        for (const item of testData) {
            try {
                const result = evaluateChain(item, chain);
                console.log('  ', result);
            } catch (e) {
                console.log('  Error:', e.message);
            }
        }
    };
    
    // Add the extensions to the REPL context
    r.context.String = String;
    r.context.Array = Array;
    
    // Add a function to simulate the main js functionality
    r.context.js = function(chain) {
        console.log('Applying chain:', chain);
        for (const item of testData) {
            try {
                const result = evaluateChain(item, chain);
                console.log('  ', result);
            } catch (e) {
                console.log('  Error:', e.message);
            }
        }
    };
    
    // Add the evaluateChain function to the context too
    r.context.evaluateChain = evaluateChain;
    
    // Welcome message
    r.on('reset', () => {
        console.log('js-stream-tool REPL - Type ".help" for commands');
    });
}