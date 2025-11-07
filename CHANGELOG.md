# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4] - 2025-11-07
### Added
- Added `.prefix(text)` and `.suffix(text)` methods
- Added shorthand `.pre(text)` and `.suf(text)` methods  
- Added `.toLength()` method to convert string length to string representation

### Improved  
- Null/undefined values in ternary operations now properly filter out lines
- Boolean operations act as filters vs. transformations - documentation updated

### Fixed
- All existing functionality continues to work with new additions

### Examples
- `.includes("a") ? .toUpperCase() : null` only outputs if condition is true
- `.toLength().concat(" characters")` can chain length operations

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