# 🧪 js-stream-tool: Examples & Use Cases

This document provides extensive examples organized by complexity level and use case.

## 🟢 Beginner Examples

### Basic String Operations
```bash
# Uppercase conversion
echo "hello world" | js '.toUpperCase()'
# → HELLO WORLD

# Lowercase conversion  
echo "HELLO WORLD" | js '.toLowerCase()'
# → hello world

# Replace characters
echo "2025-11-21" | js '.replaceAll("-", "/")'
# → 2025/11/21

# Get string length
echo "hello" | js '.length'
# → 5 (Note: this returns the number, not a string)

# String transformation
echo "hello world" | js '.toUpperCase().color("green")'
# → HELLO WORLD (in green)
```

### Basic Filtering
```bash
# Filter lines containing specific text
echo -e "hello\ntest\nworld" | js '.includes("test")'
# → outputs only: test

# Filter by starting character
ls -la | js '.startsWith("d")'
# → outputs only lines starting with 'd' (directories)

# Combine filtering with transformation
echo -e "apple\nbanana\napple pie" | js '.includes("apple")'
# → outputs: apple and apple pie
```

## 🟡 Intermediate Examples

### Array Operations
```bash
# Split and get specific element
echo "apple,banana,cherry,date" | js '.split(",").get(2)'
# → cherry

# Get first element
echo "apple,banana,cherry" | js '.split(",").first()'
# → apple

# Get last element  
echo "apple,banana,cherry" | js '.split(",").last()'
# → cherry

# Compact (remove empty strings)
echo ",hello,,world," | js '.split(",").compact().join(", ")'
# → hello, world
```

### Color Operations
```bash
# Simple coloring
echo "warning" | js '.color("red")'
# → warning (in red)

# Combine operations with colors
echo "success" | js '.toUpperCase().color("green")'
# → SUCCESS (in green)

# Multiple color operations
echo "high priority" | js '.color("bgRed").color("white")'
# → high priority (with red background and white text)
```

### Conditional Operations (Ternary)
```bash
# Basic ternary
echo "hello" | js '.includes("h") ? .toUpperCase() : .toLowerCase()'
# → HELLO (because it includes "h")

echo "hello" | js '.includes("z") ? .toUpperCase() : .toLowerCase()'
# → hello (because it doesn't include "z")

# Ternary with null filtering
echo "test" | js '.includes("x") ? .toUpperCase() : null'
# → (no output, because condition is false and null suppresses output)

# Ternary with conditional coloring
echo "error message" | js '.includes("error") ? .color("red") : .color("blue")'
# → error message (in red)
```

## 🔴 Advanced Examples

### Complex Data Processing
```bash
# Combine multiple operations
echo "apple,banana,cherry,date" | js '.split(",").filter(fruit => fruit.length > 4).map(fruit => fruit.toUpperCase()).join("-")'
# → APPLE-BANANA-DATE (cherry filtered out because length <= 4)

# Advanced filtering and transformation
ls -l | js '.includes(" js").split(" ").pop().color("green")'
# → extracts and colors JavaScript filenames from ls output
```

### Highlight Operations
```bash
# Highlight specific strings
echo "document.pdf and image.jpg" | js '.highlight("pdf", "red")'
# → document in red, rest unchanged

# Highlight multiple strings
echo "apple banana cherry apple" | js '.highlight(["apple", "cherry"], "blue")'
# → apple and cherry in blue, banana unchanged

# Highlight with regex
echo "Date: 2023-12-25" | js '.highlightRegex(/\\d{4}-\\d{2}-\\d{2}/, "green")'
# → date portion in green

# Auto-highlight common patterns
echo "file.txt from 2023-12-25" | js '.highlightAny()'
# → filename and date highlighted in default colors
```

### Validation Functions
```bash
# Check if string represents a number
echo "123" | js '.isNumber()'
# → outputs: 123 (because it's a number)

echo "abc" | js '.isNumber()'
# → no output (because it's not a number)

# Check if file exists
echo "package.json" | js '.isFile()'
# → outputs: package.json (if file exists)

# Conditional operations based on validation
echo "test123.txt" | js '.isNumber() ? .color("red") : .color("blue")'
# → colored blue (since "test123.txt" is not a number)
```

### Chain Composition
```bash
# Save a complex chain
js -s upper-red '.toUpperCase().color("red")'

# Use the saved chain
echo "hello world" | js '$upper-red'
# → HELLO WORLD (in red)

# Save conditional logic
js -s filename-extractor '.includes("test") ? .split(" ").pop().pre("File: ").color("blue") : null'

# Use the conditional chain
ls -la | js '$filename-extractor'
# → extracts and formats filenames that contain "test"
```

### Conditional Functions
```bash
# Use .when() for conditional operations
echo "test123" | js '.when(/\d+/, str => str.color("red"))'
# → test123 in red (number detected)

echo "test" | js '.when(/\d+/, str => str.color("red"))'
# → test (unchanged, no number detected)

# Use .whenMatch() for pattern-based operations
echo "error in code" | js '.whenMatch("error", "red")'
# → error in code in red
```

## 🎯 Real-World Use Cases

### Log File Analysis
```bash
# Extract error lines and highlight them
tail -f app.log | js '.includes("ERROR") ? .color("red") : .color("gray")'

# Filter for specific timestamp format
grep "2023-11" logs.txt | js '.highlightRegex(/\\d{4}-\\d{2}-\\d{2}/, "blue")'
```

### File Processing
```bash
# Process file listings and highlight different types
ls -l | js '.includes(".js") ? .color("yellow") : .includes(".json") ? .color("cyan") : .color("white")'

# Extract and format filenames from build output
npm run build | js '.includes("dist/") ? .split(" ").pop().color("green") : null'
```

### Data Manipulation
```bash
# Process CSV-like data
echo "name,age,city" | js '.split(",").map(field => field.toUpperCase()).join(" | ")'
# → NAME | AGE | CITY

# Format JSON output
echo '{"name":"john","age":30}' | js '.replace("{", "").replace("}", "").split(",").map(item => item.split(":")[0]).join(", ")'
# → name, age
```

These examples demonstrate the versatility of js-stream-tool for various text processing tasks!