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

// --- Custom Functions (available within the eval scope) ---
const last = (arr) => Array.isArray(arr) ? arr[arr.length - 1] : undefined;
const pop = last; // Alias for pop()
const first = (arr) => Array.isArray(arr) ? arr[0] : undefined;
const compact = (arr) => Array.isArray(arr) ? arr.filter(item => item && item.trim() !== '') : arr;
const get = (arr, index) => Array.isArray(arr) ? arr[parseInt(index, 10)] : undefined;

function addExtensions() {
    // Add color method to String prototype
    if (!String.prototype.color) {
        String.prototype.color = function(colorName) {
            const colorCode = colors[colorName] || colors.reset;
            return `${colorCode}${this}${colors.reset}`;
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
    
    // Add length as string method
    if (!String.prototype.toLength) {
        String.prototype.toLength = function() {
            return this.length.toString();
        };
    }
    
    // Add shorthand aliases
    if (!String.prototype.pre) {
        String.prototype.pre = String.prototype.prefix;
    }
    
    if (!String.prototype.suf) {
        String.prototype.suf = String.prototype.suffix;
    }
    
    // Add conditional methods to String prototype
    
    // .when(condition, trueOperation, falseOperation) - conditionally apply operations with else clause
    if (!String.prototype.when) {
        String.prototype.when = function(condition, trueOperation, falseOperation) {
            // If condition is a function, call it with current value
            let testResult = condition;
            if (typeof condition === 'function') {
                testResult = condition(this);
            } else if (condition instanceof RegExp) {
                testResult = this.search(condition) !== -1;
            } else if (typeof condition === 'string') {
                testResult = this.includes(condition);
            }
            // If condition is boolean, use it directly
            
            // If condition is true, apply the trueOperation, otherwise apply falseOperation if provided
            if (testResult) {
                if (typeof trueOperation === 'function') {
                    return trueOperation(this);
                } else {
                    // If it's a string operation like color name, apply it appropriately
                    return this.valueOf(); // Just return the original for now
                }
            } else if (falseOperation) {
                // Apply the false operation if provided
                if (typeof falseOperation === 'function') {
                    return falseOperation(this);
                } else {
                    // If it's a string operation like color name, apply it appropriately
                    return this.valueOf(); // Just return the original for now
                }
            }
            return this.valueOf();
        };
    }
    
    // .switch(valueArray, functionArray) - switch-like functionality with value matching
    if (!String.prototype.switch) {
        String.prototype.switch = function(valueArray, functionArray) {
            // Validate inputs
            if (!Array.isArray(valueArray) || !Array.isArray(functionArray)) {
                return this.valueOf(); // Return original if not arrays
            }
            
            // Find the index of the current value in the valueArray
            const currentIndex = valueArray.indexOf(this.valueOf());
            
            // If found, apply the corresponding function from functionArray
            if (currentIndex !== -1 && currentIndex < functionArray.length) {
                const operation = functionArray[currentIndex];
                if (typeof operation === 'function') {
                    return operation(this);
                }
            }
            
            // If not found or no function matches, return original value
            return this.valueOf();
        };
    }
    
    // .switchCase(caseObject) - enhanced switch with object mapping
    if (!String.prototype.switchCase) {
        String.prototype.switchCase = function(caseObject) {
            // Validate input
            if (typeof caseObject !== 'object' || caseObject === null) {
                return this.valueOf(); // Return original if not an object
            }
            
            // Check if the current value exists as a key in the caseObject
            const currentValue = this.valueOf();
            if (caseObject.hasOwnProperty(currentValue)) {
                const operation = caseObject[currentValue];
                if (typeof operation === 'function') {
                    return operation(this);
                } else if (typeof operation === 'string') {
                    // If operation is a color name, apply color
                    const colorCode = colors[operation] || colors.reset;
                    return `${colorCode}${this}${colors.reset}`;
                }
            }
            
            // If no case matches, return original value
            return this.valueOf();
        };
    }
    
    // .whenMatch(pattern, operation) - applies operation if pattern matches
    if (!String.prototype.whenMatch) {
        String.prototype.whenMatch = function(pattern, operation) {
            let matches = false;
            
            if (pattern instanceof RegExp) {
                matches = this.search(pattern) !== -1;
            } else if (typeof pattern === 'string') {
                matches = this.includes(pattern);
            }
            
            if (matches) {
                if (typeof operation === 'function') {
                    return operation(this);
                } else if (typeof operation === 'string') {
                    // Assume operation is a color name
                    const colorCode = colors[operation] || colors.reset;
                    return `${colorCode}${this}${colors.reset}`;
                }
            }
            return this.valueOf();
        };
    }
    
    // Add validation methods to String prototype (is* functions)
    
    // Check if string is a valid filename (simple check)
    if (!String.prototype.isFile) {
        String.prototype.isFile = function() {
            const fs = require('fs');
            const path = require('path');
            try {
                const resolvedPath = path.resolve(this.valueOf());
                return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile();
            } catch (e) {
                return false; // If there's an error accessing the file, return false
            }
        };
    }
    
    // Check if string is a valid directory
    if (!String.prototype.isDirectory) {
        String.prototype.isDirectory = function() {
            const fs = require('fs');
            const path = require('path');
            try {
                const resolvedPath = path.resolve(this.valueOf());
                return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory();
            } catch (e) {
                return false;
            }
        };
    }
    
    // Check if string is a number
    if (!String.prototype.isNumber) {
        String.prototype.isNumber = function() {
            return !isNaN(this.valueOf()) && !isNaN(parseFloat(this.valueOf()));
        };
    }
    
    // Check if string is an integer
    if (!String.prototype.isInteger) {
        String.prototype.isInteger = function() {
            const val = this.valueOf();
            return !isNaN(val) && parseInt(Number(val)) == val && !isNaN(parseInt(val, 10));
        };
    }
    
    // Check if string is a valid date format
    if (!String.prototype.isDate) {
        String.prototype.isDate = function() {
            const dateRegexes = [
                /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
                /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
                /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
                /^\d{2}-\d{2}-\d{4}$/ // MM-DD-YYYY
            ];
            
            for (const regex of dateRegexes) {
                if (regex.test(this.valueOf())) {
                    const date = new Date(this.valueOf().replace(/-/g, '/'));
                    return date instanceof Date && !isNaN(date);
                }
            }
            return false;
        };
    }
    
    // Check if string is a valid email
    if (!String.prototype.isEmail) {
        String.prototype.isEmail = function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(this.valueOf());
        };
    }
    
    // Check if string is a valid URL
    if (!String.prototype.isURL) {
        String.prototype.isURL = function() {
            try {
                new URL(this.valueOf());
                return true;
            } catch (e) {
                return false;
            }
        };
    }
    
    // Check if string is an IP address
    if (!String.prototype.isIP) {
        String.prototype.isIP = function() {
            const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
            const ipv6Regex = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;
            
            if (ipv4Regex.test(this.valueOf())) {
                const parts = this.valueOf().split('.');
                return parts.every(part => parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255);
            }
            return ipv6Regex.test(this.valueOf());
        };
    }
    
    // Check if string is a valid filename pattern (has extension)
    if (!String.prototype.isFilename) {
        String.prototype.isFilename = function() {
            const filenameRegex = /^[\w,\s-]+\.[A-Za-z]{2,}$/;
            return filenameRegex.test(this.valueOf());
        };
    }
    
    // Add highlight methods to String prototype
    if (!String.prototype.highlight) {
        String.prototype.highlight = function(pattern, colorName) {
            // If pattern is a string, highlight all occurrences of that string
            if (typeof pattern === 'string') {
                const colorCode = colors[colorName] || colors.reset;
                // Properly escape special regex characters
                const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return this.replace(new RegExp(escapedPattern, 'g'), 
                    match => `${colorCode}${match}${colors.reset}`);
            }
            // If pattern is an array, highlight each element in the array
            else if (Array.isArray(pattern)) {
                let result = this.valueOf(); // Get the string value
                for (const item of pattern) {
                    const colorCode = colors[colorName] || colors.reset;
                    const escapedItem = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    result = result.replace(new RegExp(escapedItem, 'g'), 
                        match => `${colorCode}${match}${colors.reset}`);
                }
                return result;
            }
            // Default: return original string
            return this.valueOf();
        };
    }
    
    if (!String.prototype.highlightRegex) {
        String.prototype.highlightRegex = function(pattern, colorName) {
            const colorCode = colors[colorName] || colors.reset;
            const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern;
            return this.replace(regex, match => `${colorCode}${match}${colors.reset}`);
        };
    }
    
    if (!String.prototype.highlightFilenames) {
        String.prototype.highlightFilenames = function(colorName) {
            const color = colorName || 'blue';
            // Match filenames: words with extensions like .txt, .js, etc. or common filename patterns
            const filenameRegex = /\b[\w\-@%+.~]*\.[a-zA-Z]{2,}\b|\b\w+\/\w+\b/g;
            return this.highlightRegex(filenameRegex, color);
        };
    }
    
    if (!String.prototype.highlightDates) {
        String.prototype.highlightDates = function(colorName) {
            const color = colorName || 'green';
            // Match various date formats: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, etc.
            const dateRegex = /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{2}\b/g;
            return this.highlightRegex(dateRegex, color);
        };
    }
    
    if (!String.prototype.highlightNumbers) {
        String.prototype.highlightNumbers = function(colorName) {
            const color = colorName || 'yellow';
            // Match numbers (integers and decimals, including those in file sizes)
            const numberRegex = /\b\d+\.?\d*\b/g;
            return this.highlightRegex(numberRegex, color);
        };
    }
    
    if (!String.prototype.highlightAny) {
        String.prototype.highlightAny = function(exclude = []) {
            let result = this.valueOf();
            
            // Define highlight types with their default colors
            const highlightTypes = {
                'dates': { regex: /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{2}\b/g, color: 'green' },
                'filenames': { regex: /\b[\w\-@%+.~]*\.[a-zA-Z]{2,}\b|\b\w+\/\w+\b/g, color: 'blue' },
                'numbers': { regex: /\b\d+\.?\d*\b/g, color: 'yellow' },
                'emails': { regex: /\b[\w.-]+@[\w.-]+\.\w+\b/g, color: 'magenta' },
                'urls': { regex: /\bhttps?:\/\/[\w.-]+\.[\w.-]+(?:\/[\w.-]*)*\b/g, color: 'brightBlue' },
                'ips': { regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, color: 'cyan' }
            };
            
            // Apply highlights for types not in exclude list
            for (const [type, config] of Object.entries(highlightTypes)) {
                if (!exclude.includes(type)) {
                    const { regex, color } = config;
                    result = result.replace(regex, match => {
                        const colorCode = colors[color] || colors.reset;
                        return `${colorCode}${match}${colors.reset}`;
                    });
                }
            }
            
            return result;
        };
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
    
    if (!Array.prototype.filterArray) {
        Array.prototype.filterArray = function(callback) {
            // This is a custom filter that works with our eval context
            return this.filter(callback);
        };
    }
}

module.exports = { addExtensions, colors, color, last, pop, first, compact, get };