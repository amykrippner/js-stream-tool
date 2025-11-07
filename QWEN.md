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