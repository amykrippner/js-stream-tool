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
}

module.exports = { addExtensions, colors, color, last, pop, first, compact, get };