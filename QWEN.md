# Project Configuration

## Default Highlight Colors

These are the default colors used for automatic highlighting functions:

- **Filenames**: blue
- **Dates**: green  
- **Numbers**: yellow
- **IP Addresses**: cyan
- **Emails**: magenta
- **URLs**: brightBlue
- **Keywords** (if any): red

## Configuration

Default colors can be overridden via CLI for automatic highlighting functions.

## Features

This project contains a modular JavaScript stream processing tool that allows:
- Method chaining for text processing
- Color highlighting of text parts
- Chain composition and reuse
- Ternary operations and filtering

## Methodology & Architecture

### Pure Node.js Development
- Entire project built with native Node.js modules only
- Zero external dependencies - completely self-contained
- Modular architecture with clear separation of concerns

### Core Principles
- **Gradual Enhancement**: Start with basic functionality and progressively add features while maintaining backwards compatibility
- **Clean Architecture**: Separate modules for core logic, evaluation, string extensions, array operations, and help text
- **Security First**: Implement safe evaluation of user functions with proper context isolation
- **Performance Conscious**: Efficient line-by-line processing without unnecessary memory buffering

### Development Workflow
1. **Design First**: Plan the API and usage patterns before implementation
2. **Test Driven**: Write tests for new functionality before implementation
3. **Modular**: Each module has a single area of responsibility
4. **Documentation**: Update help, README, and changelog with each feature
5. **Validation**: Ensure all existing functionality continues to work

### Architecture Modules
- `js.js` - Entry point and main CLI interface
- `core.js` - Core processing logic and line-by-line processing
- `evaluator.js` - Safe evaluation of user chains with context
- `extensions.js` - String and Array prototype extensions
- `help.js` - Help text and documentation
- `chain-composition.js` - Save/retrieve chain functionality

### Testing Philosophy
- Comprehensive test coverage for all new features
- Organized tests by functionality groups (basic, array, color, conditional, etc.)
- Maintain backwards compatibility - all existing tests must continue to pass
- Clear test naming that describes the expected behavior

### Documentation & Behavioral Notes
- Document the differences from regular JavaScript behavior (see DIFFERENCES.md)
- Clearly explain filter vs transform operations
- Address common misunderstandings and pitfalls
- Provide examples of proper usage patterns

## Development Workflow

When implementing new features, follow this standard checklist:

1. **Implementation** - Write the new functionality
2. **Update README** - Add documentation and examples to README.md
3. **Update CLI --help** - Add new functions to help system
4. **Write tests** - Create comprehensive tests for the new functionality
5. **Update changelog** - Document changes in CHANGELOG.md
6. **Bump version** - Update package.json version
7. **Test compatibility** - Ensure existing functionality still works
8. **Configuration** - Update QWEN.md as needed