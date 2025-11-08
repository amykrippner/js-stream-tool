# Changelog

All notable changes to this project will be documented in this file.

## [1.1.3] - 2025-11-08
### Added
- Added `.not(pattern)` function as the inverse of `.has()`:
  - "Go further or die" filter that continues chain if pattern is NOT found
  - Returns original string if pattern not found, null if pattern found
  - Perfect for filtering lines that don't contain specific text
- Enhanced `.has(pattern)` with safe error handling:
  - No more "Cannot read properties of null" errors when chaining methods
  - Now properly handles method calls after `.has()` returns null
  - Maintains "go further or die" filtering behavior
- Added comprehensive documentation for both `.has()` and `.not()` functions

### Examples
- `.not("error")` - continue chain for lines that don't contain "error"
- `.not("error").toUpperCase()` - uppercase lines that don't contain "error"
- `.has("root").split(" ").last()` - now works safely without errors even when "root" not found

## [1.1.2] - 2025-11-07
### Added
- Enhanced `.colorIf()` function with unified parameter support:
  - `.colorIf(condition, colorName)` - apply color if condition is true
  - Condition can be: function, regex, or string with automatic type detection
- Added `.colorIfMatch()` as alias for `.colorIf()` (maintains compatibility)
- Added comprehensive tests for new color functions
- Updated documentation and function references

### Examples
- `.colorIf(str => str.length > 5, "red")` - color red if length > 5
- `.colorIf(/\d+/, "blue")` - color blue if matches digit pattern
- `.colorIf("error", "red")` - color red if contains "error"
- `.colorIfMatch("error", "red")` - alias for same functionality

## [1.1.1] - 2025-11-07
### Added
- Added new colorIf functions for conditional coloring:
  - `.colorIf(condition, colorName)` - apply color if condition is true
  - `.colorIfMatch(pattern, colorName)` - apply color if pattern matches
- Added comprehensive tests for new color functions
- Updated documentation and function references

### Examples
- `.colorIf(str => str.length > 5, "red")` - color red if length > 5
- `.colorIf(/\d+/, "blue")` - color blue if contains digits
- `.colorIf("error", "red")` - color red if contains "error"
- `.colorIfMatch("error", "red")` - color red if contains "error"
- `.colorIfMatch(/\d+/, "green")` - color green if matches digit pattern

## [1.1.0] - 2025-11-07
### Added
- Enhanced `.when()` function with else clause support:
  - `.when(condition, trueOperation, falseOperation)` - conditional operations with else clause
  - Added `falseOperation` parameter for negative condition handling
- Added new switch functions for multiple value matching:
  - `.switch(valueArray, functionArray)` - switch-like operation with value matching
  - `.switchCase(caseObject)` - switch-like operation with object mapping
- Added comprehensive tests for new conditional functions
- Added documentation updates in help system and reference guides

### Examples
- `.when("test", str => str.toUpperCase(), str => str.toLowerCase())` - uppercase if contains "test", else lowercase
- `.switch(["a", "b", "c"], [str => str.color("red"), str => str.color("green"), str => str.color("blue")])` - match value and apply corresponding function
- `.switchCase({"error": "red", "warn": "yellow"})` - object-based switch mapping

## [1.0.8] - 2025-11-07
### Added
- Added validation functions (.is* functions):
  - `.isFile()` - check if string is an existing file
  - `.isDirectory()` - check if string is an existing directory
  - `.isNumber()` - check if string is a number
  - `.isInteger()` - check if string is an integer
  - `.isDate()` - check if string is a date format
  - `.isEmail()` - check if string is an email
  - `.isURL()` - check if string is a URL
  - `.isIP()` - check if string is an IP address
  - `.isFilename()` - check if string looks like a filename

### Examples
- `.isFile()` - returns true if file exists in filesystem
- `.isNumber()` - returns true if string can be converted to number
- `.isDate()` - returns true if string matches date formats

## [1.0.9] - 2025-11-07
### Added
- Created interactive REPL mode for real-time testing:
  - Added `interactive.js` with Node.js REPL functionality
  - Automatic piped data detection (uses first 3 piped lines)
  - Interactive commands: `.test()`, `.run()`, `.data()`, `.help()`, etc.
  - Real-time chain testing capabilities
- Implemented comprehensive test suite reorganization:
  - Created separate test files by category: `basic_operations.test.js`, `array_operations.test.js`, `color_highlight.test.js`, `conditional.test.js`, `validation.test.js`, `filter_ternary.test.js`, `long_chained.test.js`
  - Moved from single monolithic test file to organized test structure
  - Added `tests/run_tests.js` main test runner
  - Increased test count to 64+ comprehensive tests across multiple categories
- Implemented documentation restructuring:
  - Created `README.md` simplification with cross-references
  - Added `EXAMPLES.md` for comprehensive usage examples
  - Added `FUNCTION_REFERENCE.md` for complete function documentation
  - Added `PERFORMANCE.md` for detailed benchmarks
  - Added `USAGE_GUIDE.md` for patterns and best practices
  - Added `DIFFERENCES.md` for behavioral variations from normal JS
  - Updated all cross-references in documentation
- Added configuration documentation in `QWEN.md` with methodology details

### Changed
- Updated package.json to use new test runner
- Restructured project architecture for better modularity
- Improved error handling and user feedback in interactive mode
- Enhanced test reliability and coverage across all functionality

## [1.0.7] - 2025-11-07
### Added
- Added conditional execution functions:
  - `.when(condition, operation)` - conditionally apply operation if condition is true
  - `.whenMatch(pattern, operation)` - apply operation when pattern matches

### Examples
- `.when(/\d+/, str => str.color("red"))` - color the whole string red if it contains digits
- `.whenMatch("error", "red")` - color red when string contains "error"
- `.when(str => str.length > 10, str => str.toUpperCase())` - uppercase if longer than 10 chars

## [1.0.6] - 2025-11-07
### Removed
- Removed redundant `.matches()` and `.matchLine()` functions that duplicated built-in JavaScript methods

### Improved
- Cleaned up functionality to rely on JavaScript's built-in string methods for comparisons

## [1.0.5] - 2025-11-07
### Added
- Added highlight functions for partial string coloring:
  - `.highlight(pattern, color)` - highlight specific strings or arrays of strings
  - `.highlightRegex(pattern, color)` - highlight with regex patterns
  - `.highlightFilenames(color)` - highlight filenames with default blue color
  - `.highlightDates(color)` - highlight date patterns with default green color
  - `.highlightNumbers(color)` - highlight numbers with default yellow color
  - `.highlightAny([excludeTypes])` - automatically highlight common patterns

### Examples
- `.highlight("test", "red")` - highlights all "test" occurrences in red
- `.highlightFilenames()` - highlights filenames in blue by default
- `.highlightAny(['dates'])` - highlights all types except dates

## [1.0.4] - 2025-11-07
### Added
- Added `.prefix(text)` and `.suffix(text)` methods
- Added shorthand `.pre(text)` and `.suf(text)` methods
- Added `.toLength()` method to convert string length to string representation
- Improved: Null/undefined values in ternary operations now properly filter out lines
- Clarified: Boolean operations act as filters vs. transformations - documentation updated
- FEATURE: Works with all existing functionality including ternary and saved chains

## [1.0.3] - 2025-11-07
### Added
- Added support for ternary operators in method chains
- Added chain composition with save/retrieve functionality
- Added support for null/undefined filtering in ternary operations

### Examples
- `.includes("a") ? .toUpperCase() : .toLowerCase()` now works
- `js -s mychain '.toUpperCase().color("red")'` and `js '$mychain'`
- `.includes("a") ? .toUpperCase() : null` only outputs when condition is true

## [1.0.2] - 2025-11-07
### Added
- Added support for ternary operators in method chains
- Added chain composition with save/retrieve functionality

### Examples
- `.includes("a") ? .toUpperCase() : .toLowerCase()` now works
- `js -s mychain '.toUpperCase().color("red")'` and `js '$mychain'`

## [1.0.1] - 2025-11-07
### Added
- Performance benchmarks vs traditional Unix tools
- Installation options and GitHub repository link
- Improved package metadata and keywords

## [1.0.0] - 2025-11-07
### Initial Release
- JavaScript method chaining for text stream processing
- ANSI color support with `.color()` method
- Array methods like `.last()`, `.first()`, `.compact()`, `.get()`
- Direct command-line integration