# 🧰 js-stream-tool: Complete Function Reference

This document provides a comprehensive reference of all functions available in js-stream-tool.

## 📚 Table of Contents
1. [String Extensions](#string-extensions)
2. [Array Extensions](#array-extensions) 
3. [Color Functions](#color-functions)
4. [Highlight Functions](#highlight-functions)
5. [Validation Functions](#validation-functions)
6. [Conditional Functions](#conditional-functions)
7. [Prefix & Suffix Functions](#prefix--suffix-functions)
8. [Utility Functions](#utility-functions)

---

## String Extensions

### `.color(colorName)`
Colors the text using ANSI color codes.

**Examples:**
```bash
echo "Hello" | js '.color("red")'
echo "World" | js '.color("bgBlue").color("white")'
```

**Available Colors:**
- Basic: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`
- Bright: `brightBlack`, `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite`
- Background: `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`
- Styles: `bold`, `dim`, `italic`, `underline`, `blink`, `reverse`, `hidden`, `strikethrough`

---

## Array Extensions

### `.last()` / `.pop()`
Returns the last element of an array.

**Example:**
```bash
echo "a,b,c" | js '.split(",").last()'
# → c
```

### `.first()`
Returns the first element of an array.

**Example:**
```bash
echo "a,b,c" | js '.split(",").first()'
# → a
```

### `.compact()`
Removes empty strings from an array.

**Example:**
```bash
echo ",a,,b,c," | js '.split(",").compact().join(",")'
# → a,b,c
```

### `.get(index)`
Returns the element at a specific index.

**Example:**
```bash
echo "a,b,c" | js '.split(",").get(1)'
# → b
```

---

## Color Functions

### `color(text, colorName)`
Standalone function to color text.

**Example:**
```bash
echo "test" | js '.concat(" - ").concat(color("processed", "green"))'
# → test - processed (with "processed" in green)
```

---

## Highlight Functions

### `.highlight(pattern, color)`
Highlights occurrences of a string or array of strings.

**Examples:**
```bash
# Single string
echo "hello world hello" | js '.highlight("hello", "red")'
# → "hello" parts in red

# Array of strings
echo "apple banana cherry apple" | js '.highlight(["apple", "cherry"], "green")'
# → "apple" and "cherry" parts in green
```

### `.highlightRegex(pattern, color)`
Highlights text matching a regex pattern.

**Example:**
```bash
echo "Date: 2023-12-25" | js '.highlightRegex(/\\d{4}-\\d{2}-\\d{2}/, "blue")'
# → date part in blue
```

### `.highlightFilenames(color)`
Highlights filenames (defaults to blue).

**Example:**
```bash
echo "Open file.txt and doc.pdf" | js '.highlightFilenames("green")'
# → "file.txt" and "doc.pdf" in green
```

### `.highlightDates(color)`
Highlights dates (defaults to green).

**Example:**
```bash
echo "Event on 2023-12-25" | js '.highlightDates("blue")'
# → date in blue
```

### `.highlightNumbers(color)`
Highlights numbers (defaults to yellow).

**Example:**
```bash
echo "I have 123 apples" | js '.highlightNumbers("red")'
# → "123" in red
```

### `.highlightAny([excludeTypes])`
Automatically highlights common patterns with default colors.

**Example:**
```bash
echo "file.txt from 2023-12-25 with 123MB"
# Highlights all types: filenames, dates, numbers

# Exclude specific types:
echo "file.txt from 2023-12-25" | js '.highlightAny(["dates"])'
# Highlights filename but not date
```

**Default types:** dates, filenames, numbers, emails, urls, ips

---

## Validation Functions (.is*)

### `.isFile()`
Returns true if string represents an existing file.

**Example:**
```bash
echo "package.json" | js '.isFile()'  # → outputs if file exists
echo "nonexistent.txt" | js '.isFile()'  # → no output
```

### `.isDirectory()`
Returns true if string represents an existing directory.

**Example:**
```bash
echo "." | js '.isDirectory()'  # → outputs because current dir exists
```

### `.isNumber()`
Returns true if string can be converted to a valid number.

**Example:**
```bash
echo "123" | js '.isNumber()'    # → outputs: 123
echo "abc" | js '.isNumber()'    # → no output
```

### `.isInteger()`
Returns true if string represents an integer.

**Example:**
```bash
echo "123" | js '.isInteger()'   # → outputs: 123
echo "123.45" | js '.isInteger()' # → no output
```

### `.isDate()`
Returns true if string matches date formats (YYYY-MM-DD, MM/DD/YYYY, etc.).

**Example:**
```bash
echo "2023-12-25" | js '.isDate()'  # → outputs: 2023-12-25
echo "invalid" | js '.isDate()'     # → no output
```

### `.isEmail()`
Returns true if string is a valid email.

**Example:**
```bash
echo "test@example.com" | js '.isEmail()'  # → outputs: test@example.com
```

### `.isURL()`
Returns true if string is a valid URL.

**Example:**
```bash
echo "https://example.com" | js '.isURL()'  # → outputs: https://example.com
```

### `.isIP()`
Returns true if string is a valid IP address (IPv4 or IPv6).

**Example:**
```bash
echo "192.168.1.1" | js '.isIP()'  # → outputs: 192.168.1.1
```

### `.isFilename()`
Returns true if string looks like a filename (has extension).

**Example:**
```bash
echo "document.pdf" | js '.isFilename()'  # → outputs: document.pdf
```

---

## Conditional Functions

### `.when(condition, trueOperation, falseOperation)`
Conditionally applies operations with else clause.

**Examples:**
```bash
# With regex condition
echo "hello123" | js '.when(/\d+/, str => str.color("red"), str => str.color("gray"))'
# → hello123 in red (if contains digits) or gray (if not)

# With string condition
echo "error log" | js '.when("error", str => str.toUpperCase(), str => str.toLowerCase())'
# → ERROR LOG (if contains "error") or error log (if not)

# With function condition
echo "hello" | js '.when(str => str.length > 3, str => str.color("blue"), str => str.color("yellow"))'
# → HELLO in blue (if longer than 3) or yellow (if not)
```

### `.whenMatch(pattern, operation)`
Applies operation when pattern matches (string or regex). **DEPRECATED** - use `.colorIfMatch()` instead.

**Examples:**
```bash
# With string pattern
echo "error in code" | js '.whenMatch("error", "red")'
# → whole string colored red

# With regex pattern
echo "test123" | js '.whenMatch(/\d+/, str => str.toUpperCase())'
# → TEST123 (uppercase because it matches digits)
```

### `.colorIf(condition, colorName)`
Applies color if condition is true.

**Examples:**
```bash
# With function condition
echo "hello123" | js '.colorIf(str => str.length > 5, "red")'
# → hello123 in red (if length > 5)

# With regex condition
echo "test123" | js '.colorIf(/\d+/, "red")'
# → test123 in red (if contains digits)

# With string condition
echo "error message" | js '.colorIf("error", "red")'
# → "error message" in red (if contains "error")
```

### `.colorIfMatch(pattern, colorName)`
Applies color if pattern matches (string or regex).

**Examples:**
```bash
# With string pattern
echo "error in code" | js '.colorIfMatch("error", "red")'
# → "error in code" in red (if contains "error")

# With regex pattern
echo "test123" | js '.colorIfMatch(/\d+/, "blue")'
# → "test123" in blue (if matches digit pattern)
```

### `.switch(valueArray, functionArray)`
Switch-like operation with value matching.

**Examples:**
```bash
# Match different values to different operations
echo "red" | js '.switch(["red", "green", "blue"], [str => str.color("red"), str => str.color("green"), str => str.color("blue")])'
# → red in red color

echo "hello" | js '.split(" ").get(0).switch(["test", "hello", "world"], [str => str.toUpperCase(), str => str.toLowerCase(), str => str.color("yellow")])'
# → hello in lower case
```

### `.has(pattern)`
"Go further or die" filter - returns the string if it contains the pattern, null otherwise.
Use for filtering lines that match a pattern. Allows safe chaining operations on matching lines.
Pattern can be string or regex.

**Examples:**
```bash
# Filter lines containing "error"
echo -e "error line\ngood line" | js '.has("error")'
# → outputs: error line

# Chain operations on matching lines (no more errors when chaining)
echo -e "error log\ngood data" | js '.has("error").split(" ").last()'
# → log (from "error log"), good data gets filtered out
```

### `.not(pattern)`
"Go further or die" filter - returns the string if it does NOT contain the pattern, null otherwise.
This is the opposite of `.has()`. Use for filtering lines that don't match a pattern.
Pattern can be string or regex.

**Examples:**
```bash
# Process lines that don't contain "error"
echo -e "good line\nerror line" | js '.not("error")'
# → outputs: good line

# Chain operations on lines that don't contain pattern
echo -e "file1.txt\nerror.log\nfile2.txt" | js '.not("error").toUpperCase()'
# → FILE1.TXT and FILE2.TXT (in uppercase), filters out error.log
```

### `.switchCase(caseObject)`
Switch-like operation with object mapping.

**Examples:**
```bash
# Map different values to different operations
echo "error" | js '.switchCase({"error": "red", "warn": "yellow", "info": "blue"})'
# → error in red color

echo "hello" | js '.switchCase({"hello": str => str.toUpperCase(), "world": str => str.color("green")})'
# → HELLO (uppercase because it matches)
```

---

## Prefix & Suffix Functions

### `.prefix(text)` or `.pre(text)`
Adds text to the beginning of the string.

**Example:**
```bash
echo "filename" | js '.pre("File: ").color("green")'
# → File: filename (in green)
```

### `.suffix(text)` or `.suf(text)`
Adds text to the end of the string.

**Example:**
```bash
echo "document.pdf" | js '.suf(" (attached)")'
# → document.pdf (attached)
```

### `.toLength()`
Converts the string's length to a string representation.

**Example:**
```bash
echo "hello" | js '.toLength()'
# → 5 (as a string)
```

---

## Utility Functions

### Boolean Filter Operations
Operations that return booleans act as filters:
- `.includes(text)` - Filter lines containing text
- `.startsWith(text)` - Filter lines starting with text  
- `.endsWith(text)` - Filter lines ending with text
- `.match(regex)` - Filter lines matching regex

**Example:**
```bash
echo -e "hello\nworld\ntest" | js '.includes("e")'
# → outputs: hello and test (both contain 'e')
```

### Ternary Operations
Use JavaScript ternary operator for conditional processing:

**Example:**
```bash
echo "hello" | js '.includes("h") ? .toUpperCase() : .toLowerCase()'
# → HELLO (because contains 'h')

echo "hello" | js '.includes("z") ? .toUpperCase() : .toLowerCase()'
# → hello (because doesn't contain 'z')
```

### Chain Composition
- Save chains: `js -s name '<chain>'`
- Use saved chains: `js '$name'`

**Example:**
```bash
js -s upper-red '.toUpperCase().color("red")'
echo "hello" | js '$upper-red'  # → HELLO in red
```

This function reference covers all available operations in js-stream-tool!