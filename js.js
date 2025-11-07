#!/usr/bin/env node

const HELP_TEXT = `
js - JavaScript Stream Tool

A command-line utility that lets you use JavaScript's method chaining to process text streams piped from stdin.

USAGE:
  <command> | js '<chain>'
  js --help | -h
  js -s <name> '<chain>'    # Save a chain for later use
  js '$<name>'              # Use a saved chain

DESCRIPTION:
  js reads each line from stdin and applies a chain of JavaScript operations to it.
  The chain MUST be wrapped in quotes. Use alternating quotes if your arguments
  also need quotes (e.g., js '.includes("text")').

  You can save useful chains and reuse them later:
  - Save a chain: js -s <name> '<chain>'
  - Use a saved chain: js '$<name>'

  Conditional operations:
  - Ternary expressions: .includes("test") ? .toUpperCase() : .toLowerCase()
  - Filter with null: .includes("a") ? .toUpperCase() : null  # Only outputs if condition is true
  - Filter with undefined: .includes("a") ? .toUpperCase() : undefined  # Same as null

EXAMPLES:
  # Get the filenames of all .txt files
  ls -l | js '.includes(".txt").split(" ").pop()'

  # Replace all dashes with slashes and uppercase the result
  echo "2025-11-21" | js '.replaceAll("-","/").toUpperCase()'
  
  # Find lines NOT starting with a #
  cat config.ini | js '.trim().startsWith("#")==false'

  # Save a complex chain
  js -s 'upper-color' '.toUpperCase().color("red")'

  # Use the saved chain
  echo "hello" | js '$upper-color'

CUSTOM FUNCTIONS ADDED:
  .last() / .pop() - Returns the last element of an array.
  .first()         - Returns the first element of an array.
  .compact()       - Removes empty strings from an array.
  .get(index)      - Returns the element at a specific index.
  .color(color)    - Colors the text using ANSI color codes.
  .prefix(text)    - Adds text to the beginning of the string.
  .suffix(text)    - Adds text to the end of the string.
  .pre(text)       - Shorthand for .prefix(text).
  .suf(text)       - Shorthand for .suffix(text).

CHAIN COMPOSITION:
  - Save chains for reuse with -s flag: js -s <name> '<chain>'
  - Access saved chains with $name syntax: js '$<name>'
  - Perfect for complex operations you use frequently
  - Ternary operations and all methods supported in saved chains

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
const fs = require('fs');
const path = require('path');

// Configuration directory
const CONFIG_DIR = path.join(require('os').homedir(), '.js-stream-tool');
const CHAINS_FILE = path.join(CONFIG_DIR, 'saved-chains.json');

// Create config directory if it doesn't exist
if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

let chain;

// Handle save/retrieve functionality
if (args[0] === '-s' || args[0] === '--save') {
    if (args.length < 3) {
        console.error('Error: Please provide a name and a chain to save.\nUsage: js -s <name> <chain>');
        process.exit(1);
    }
    
    const name = args[1];
    const chainToSave = args.slice(2).join(' ');
    
    // Load existing saved chains
    let savedChains = {};
    if (fs.existsSync(CHAINS_FILE)) {
        try {
            savedChains = JSON.parse(fs.readFileSync(CHAINS_FILE, 'utf8'));
        } catch (e) {
            console.error('Error reading saved chains file:', e.message);
        }
    }
    
    // Save the new chain
    savedChains[name] = chainToSave;
    fs.writeFileSync(CHAINS_FILE, JSON.stringify(savedChains, null, 2));
    
    console.log(`Chain saved as "${name}": ${chainToSave}`);
    process.exit(0);
} else if (args[0] && args[0].startsWith('$')) {
    // Retrieve and use a saved chain
    const fullArg = args.join(' ');
    
    // Handle potential concatenation syntax like: js '$chain' + "text" or js '$chain' + 'text'
    const chainMatch = fullArg.match(/^\$([a-zA-Z0-9_-]+)(.*)/);
    
    if (!chainMatch) {
        console.error(`Error: Invalid saved chain format. Use $\{name} where name contains only letters, numbers, hyphens, and underscores.`);
        process.exit(1);
    }
    
    const name = chainMatch[1];
    const remaining = chainMatch[2].trim();
    
    // Load saved chains
    if (!fs.existsSync(CHAINS_FILE)) {
        console.error(`Error: No saved chains found. Use 'js -s <name> <chain>' to save a chain first.`);
        process.exit(1);
    }
    
    let savedChains;
    try {
        savedChains = JSON.parse(fs.readFileSync(CHAINS_FILE, 'utf8'));
    } catch (e) {
        console.error('Error reading saved chains:', e.message);
        process.exit(1);
    }
    
    if (!savedChains[name]) {
        console.error(`Error: No chain saved with name "${name}".`);
        console.log('Available saved chains:', Object.keys(savedChains).join(', '));
        process.exit(1);
    }
    
    chain = savedChains[name];
    
    // If there's a concatenation operation after the saved chain, we need to handle it differently
    // The command line parsing makes this complex, so we'll need to handle this in the evaluation
    // Check if there's concatenation syntax: + "text" or + 'text'
    if (remaining && remaining.startsWith('+')) {
        // Extract the text to concatenate
        const concatMatch = remaining.match(/^\+\s*(['"]?)(.*?)\1\s*$/);
        if (concatMatch) {
            const textToAppend = concatMatch[2];
            // This is a special case that needs to build a new chain expression
            chain = `${chain}.concat("${textToAppend}")`;
        } else {
            // If the remaining text doesn't match the simple concatenation pattern,
            // we'll need to treat it differently or show an error
            console.error(`Error: Invalid concatenation syntax. Expected: $\{name} + "text"`);
            process.exit(1);
        }
    }
} else {
    chain = args.join(' ').replace(/^['"]|['"]$/g, '');
}

if (!chain || !chain.startsWith('.')) {
    if (chain) {
        console.error(`Error: Invalid operation chain provided: "${chain}"\n -> The chain must start with a '.'`);
    } else {
        console.error('Error: No chain provided. Use -s to save a chain or $name to retrieve one.');
    }
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
        // For more complex JavaScript expressions including ternary operators,
        // we need to handle them differently than simple method chains
        let result;
        
        // Check if the chain contains a ternary operator
        if (chain.includes('?') && chain.includes(':')) {
            // For ternary expressions, we evaluate them as complete expressions
            // The user should write something like: .includes("test") ? .toUpperCase() : .toLowerCase()
            // We need to replace the standalone dots in the ternary with proper currentValue references
            const processedChain = chain
                .replace(/\s\?\s\./g, ' ? currentValue.')
                .replace(/\s:\s\./g, ' : currentValue.')
                .replace(/^\./, 'currentValue.'); // Replace the initial dot
            
            result = eval(`
                (function() {
                    const colors = ${JSON.stringify(colors)};
                    
                    // Add color method to String prototype
                    if (!String.prototype.color) {
                        String.prototype.color = function(colorName) {
                            const colorCode = colors[colorName] || colors.reset;
                            return \`\${colorCode}\${this}\${colors.reset}\`;
                        };
                    }
                    
                    // Add prefix/suffix methods to String prototype
                    if (!String.prototype.prefix) {
                        String.prototype.prefix = function(text) {
                            return text + this;
                        };
                    }
                    
                    if (!String.prototype.suffix) {
                        String.prototype.suffix = function(text) {
                            return this + text;
                        };
                    }
                    
                    // Add shorthand aliases
                    if (!String.prototype.pre) {
                        String.prototype.pre = String.prototype.prefix;
                    }
                    
                    if (!String.prototype.suf) {
                        String.prototype.suf = String.prototype.suffix;
                    }
                    
                    // Add custom methods to Array prototype
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
                    
                    return (${processedChain});
                })()
            `);
        } else {
            // For simple method chains (original behavior)
            result = eval(`
                (function() {
                    const colors = ${JSON.stringify(colors)};
                    
                    // Add color method to String prototype
                    if (!String.prototype.color) {
                        String.prototype.color = function(colorName) {
                            const colorCode = colors[colorName] || colors.reset;
                            return \`\${colorCode}\${this}\${colors.reset}\`;
                        };
                    }
                    
                    // Add prefix/suffix methods to String prototype
                    if (!String.prototype.prefix) {
                        String.prototype.prefix = function(text) {
                            return text + this;
                        };
                    }
                    
                    if (!String.prototype.suffix) {
                        String.prototype.suffix = function(text) {
                            return this + text;
                        };
                    }
                    
                    // Add shorthand aliases
                    if (!String.prototype.pre) {
                        String.prototype.pre = String.prototype.prefix;
                    }
                    
                    if (!String.prototype.suf) {
                        String.prototype.suf = String.prototype.suffix;
                    }
                    
                    // Add custom methods to Array prototype
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
        }

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
});