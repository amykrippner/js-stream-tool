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
  .last() / .pop()    - Returns the last element of an array.
  .first()            - Returns the first element of an array.
  .compact()          - Removes empty strings from an array.
  .get(index)         - Returns the element at a specific index.
  .color(color)       - Colors the text using ANSI color codes.
  .prefix(text)       - Adds text to the beginning of the string.
  .suffix(text)       - Adds text to the end of the string.
  .toLength()         - Converts the string's length to a string representation.
  .pre(text)          - Shorthand for .prefix(text).
  .suf(text)          - Shorthand for .suffix(text).

HIGHLIGHT FUNCTIONS:
  .highlight(pattern, color)      - Highlights occurrences of a string or array of strings.
  .highlightRegex(pattern, color) - Highlights text matching a regex pattern.
  .highlightFilenames(color)      - Highlights filenames (defaults to blue).
  .highlightDates(color)          - Highlights dates (defaults to green).
  .highlightNumbers(color)        - Highlights numbers (defaults to yellow).
  .highlightAny([excludeTypes])   - Automatically highlights common patterns with default colors,
                                    excluding specified types from highlighting.
                                    Default types: dates, filenames, numbers, emails, urls, ips.

CONDITIONAL FUNCTIONS:
  .when(condition, operation)    - Conditionally applies operation if condition is true.
                                   Condition can be regex, string, or function.
                                   Operation is applied only when condition matches.
  .whenMatch(pattern, operation) - Applies operation when pattern matches (string or regex).
                                   Operation can be a function or color name.

VALIDATION FUNCTIONS (.is*):
  .isFile()       - Returns true if the string represents an existing file in the filesystem.
  .isDirectory()  - Returns true if the string represents an existing directory in the filesystem.
  .isNumber()     - Returns true if the string can be converted to a valid number.
  .isInteger()    - Returns true if the string represents an integer.
  .isDate()       - Returns true if the string matches common date formats (YYYY-MM-DD, MM/DD/YYYY, etc.).
  .isEmail()      - Returns true if the string matches email format.
  .isURL()        - Returns true if the string is a valid URL.
  .isIP()         - Returns true if the string is a valid IP address (IPv4 or IPv6).
  .isFilename()   - Returns true if the string looks like a filename (has extension).

NOTE: Operations that return booleans (like .includes(), .startsWith()) act as filters:
  - TRUE: outputs the original line unchanged
  - FALSE: suppresses output (no line printed)
  For transformations, use operations that return strings or numbers.

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

module.exports = { HELP_TEXT };