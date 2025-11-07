#!/usr/bin/env node

const HELP_TEXT = `
js - JavaScript Stream Tool

A command-line utility that lets you use JavaScript's method chaining to process text streams piped from stdin.

USAGE:
  <command> | js '<chain>'
  js --help | -h

DESCRIPTION:
  js reads each line from stdin and applies a chain of JavaScript operations to it.
  The chain MUST be wrapped in quotes. Use alternating quotes if your arguments
  also need quotes (e.g., js '.includes("text")').

EXAMPLES:
  # Get the filenames of all .txt files
  ls -l | js '.includes(".txt").split(" ").pop()'

  # Replace all dashes with slashes and uppercase the result
  echo "2025-11-21" | js '.replaceAll("-","/").toUpperCase()'
  
  # Find lines NOT starting with a #
  cat config.ini | js '.trim().startsWith("#")==false'

CUSTOM FUNCTIONS ADDED:
  .last() / .pop() - Returns the last element of an array.
  .first()         - Returns the first element of an array.
  .compact()       - Removes empty strings from an array.
  .get(index)      - Returns the element at a specific index.
  .color(color)    - Colors the text using ANSI color codes.

COLOR FUNCTIONS AVAILABLE:
  color(text, colorName) - Wraps text in ANSI color codes.
    Available colors: black, red, green, yellow, blue, magenta, cyan, white,
    brightBlack, brightRed, brightGreen, brightYellow, brightBlue, 
    brightMagenta, brightCyan, brightWhite
    Available styles: bold, dim, italic, underline, blink, reverse, hidden, strikethrough
    Background colors: bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, 
    bgCyan, bgWhite, bgBrightBlack, bgBrightRed, bgBrightGreen, bgBrightYellow, 
    bgBrightBlue, bgBrightMagenta, bgBrightCyan, bgBrightWhite
`;

// --- Custom Functions (available within the eval scope) ---
const last = (arr) => Array.isArray(arr) ? arr[arr.length - 1] : undefined;
const pop = last; // Alias for pop()
const first = (arr) => Array.isArray(arr) ? arr[0] : undefined;
const compact = (arr) => Array.isArray(arr) ? arr.filter(item => item && item.trim() !== '') : arr;
const get = (arr, index) => Array.isArray(arr) ? arr[parseInt(index, 10)] : undefined;

// --- ANSI Color Functions ---
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  strikethrough: '\x1b[9m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  bgBrightBlack: '\x1b[100m',
  bgBrightRed: '\x1b[101m',
  bgBrightGreen: '\x1b[102m',
  bgBrightYellow: '\x1b[103m',
  bgBrightBlue: '\x1b[104m',
  bgBrightMagenta: '\x1b[105m',
  bgBrightCyan: '\x1b[106m',
  bgBrightWhite: '\x1b[107m'
};

// Color function that can wrap text in colors
const color = (text, colorName) => {
  const colorCode = colors[colorName] || colors.reset;
  return `${colorCode}${text}${colors.reset}`;
};


function showHelp() {
  console.log(HELP_TEXT);
  process.exit(0);
}

// --- Argument Handling ---
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
}

const readline = require('readline');
const chain = args.join(' ').replace(/^['"]|['"]$/g, '');

if (!chain.startsWith('.')) {
    console.error(`Error: Invalid operation chain provided: "${chain}"\n -> The chain must start with a '.'`);
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
});

rl.on('line', (line) => {
    let currentValue = line;
    let shouldContinue = true;

    try {
        // Extend String and Array prototypes with custom methods and make all functions available
        const result = eval(`
            (function() {
                const colors = ${JSON.stringify(colors)};
                
                // Add color method to String prototype
                if (!String.prototype.color) {
                    String.prototype.color = function(colorName) {
                        const colorCode = colors[colorName] || colors.reset;
                        return \`\${colorCode}\${this}\${colors.reset}\`;
                    };
                }
                
                // Add custom methods to Array prototype
                // NOTE: Not overriding the built-in Array.pop() method to avoid side effects
                // The help text mentions .last() / .pop() but we'll implement .last() only
                // to avoid the destructive behavior of the original pop() method
                if (!Array.prototype.last) {
                    Array.prototype.last = function() {
                        return this[this.length - 1];
                    };
                }
                
                if (!Array.prototype.first) {
                    Array.prototype.first = function() {
                        return this[0];
                    };
                }
                
                if (!Array.prototype.compact) {
                    Array.prototype.compact = function() {
                        return this.filter(item => item && item.trim && item.trim() !== '' || item);
                    };
                }
                
                if (!Array.prototype.get) {
                    Array.prototype.get = function(index) {
                        return this[parseInt(index, 10)];
                    };
                }
                
                // Make color function available globally for more complex operations
                const color = function(text, colorName) {
                    const colorCode = colors[colorName] || colors.reset;
                    return \`\${colorCode}\${text}\${colors.reset}\`;
                };
                
                return currentValue${chain};
            })()
        `);

        if (typeof result === 'boolean') {
            if (!result) {
                shouldContinue = false;
            }
            // If true, we output the original line, so currentValue is not changed
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
});