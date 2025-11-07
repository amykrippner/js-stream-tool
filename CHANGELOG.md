# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-07
### Initial Release
- JavaScript method chaining for text stream processing
- ANSI color support with `.color()` method
- Array methods like `.last()`, `.first()`, `.compact()`, `.get()`
- Direct command-line integration

## [1.0.1] - 2025-11-07
### Added
- Performance benchmarks vs traditional Unix tools
- Installation options and GitHub repository link
- Improved package metadata and keywords

## [1.0.2] - 2025-11-07
### Added
- Added support for ternary operators in method chains
- Added chain composition with save/retrieve functionality

### Examples
- `.includes("a") ? .toUpperCase() : .toLowerCase()` now works
- `js -s mychain '.toUpperCase().color("red")'` and `js '$mychain'`

## [1.0.3] - 2025-11-07
### Added
- Added support for ternary operators in method chains
- Added chain composition with save/retrieve functionality
- Added support for null/undefined filtering in ternary operations

### Examples
- `.includes("a") ? .toUpperCase() : .toLowerCase()` now works
- `js -s mychain '.toUpperCase().color("red")'` and `js '$mychain'`
- `.includes("a") ? .toUpperCase() : null` only outputs when condition is true

## [1.0.4] - 2025-11-07
### Added
- Added `.prefix(text)` and `.suffix(text)` methods
- Added shorthand `.pre(text)` and `.suf(text)` methods
- Added `.toLength()` method to convert string length to string representation
- Improved: Null/undefined values in ternary operations now properly filter out lines
- Clarified: Boolean operations act as filters vs. transformations - documentation updated
- FEATURE: Works with all existing functionality including ternary and saved chains

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

## [1.0.6] - 2025-11-07
### Removed
- Removed redundant `.matches()` and `.matchLine()` functions that duplicated built-in JavaScript methods

### Improved
- Cleaned up functionality to rely on JavaScript's built-in string methods for comparisons

## [1.0.7] - 2025-11-07
### Added
- Added conditional execution functions:
  - `.when(condition, operation)` - conditionally apply operation if condition is true
  - `.whenMatch(pattern, operation)` - apply operation when pattern matches

### Examples
- `.when(/\d+/, str => str.color("red"))` - color the whole string red if it contains digits
- `.whenMatch("error", "red")` - color red when string contains "error"
- `.when(str => str.length > 10, str => str.toUpperCase())` - uppercase if longer than 10 chars

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