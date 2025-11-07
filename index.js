#!/usr/bin/env node

const { processLine } = require('./core');
const readline = require('readline');

// --- Argument Handling ---
const args = process.argv.slice(2);

// Handle help first
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(require('./help').HELP_TEXT);
    process.exit(0);
}

const chain = require('./chain-composition').handleChainComposition(args);
if (!chain) process.exit(1); // Exit if chain composition handled or failed

if (!chain.startsWith('.')) {
    console.error(`Error: Invalid operation chain provided: "${chain}"\n -> The chain must start with a '.'`);
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
});

rl.on('line', (line) => {
    processLine(line, chain);
});