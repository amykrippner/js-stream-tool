# 📖 js-stream-tool: Usage Guide

This guide provides patterns and best practices for common text processing tasks with js-stream-tool.

## 🎯 Pattern Categories

### 🔍 Filtering Operations
Use boolean-returning functions to control which lines appear in output.

**Basic Filtering:**
```bash
# Filter lines containing specific text
grep "pattern" file.txt | js '.includes("specific")'

# Filter by line characteristics
ls -l | js '.startsWith("-")'           # Files only
ls -l | js '.startsWith("d")'           # Directories only
cat config.ini | js '.trim().startsWith(";")==false'  # Skip comments
```

**Advanced Filtering:**
```bash
# Multiple conditions
echo -e "apple\nbanana\ncherry\napricot" | js '.includes("a") && .length > 5'

# Using validation functions
ls -la | js '.split(" ").pop().isFile()'  # Only real files
```

### ✨ Transformation Operations
Use value-returning functions to change the output format.

**Basic Transformations:**
```bash
# Case changes
echo "hello world" | js '.toUpperCase()'
echo "HELLO WORLD" | js '.toLowerCase()'

# Character replacement
echo "2023-11-21" | js '.replaceAll("-", "/")'

# Split/process/join operations
echo "apple,banana,cherry" | js '.split(",").reverse().join(" | ")'
```

**Complex Transformations:**
```bash
# Combine multiple ops
echo "hello world" | js '.toUpperCase().color("green").concat(" - processed")'

# Process each part separately
echo "apple,banana,cherry" | js '.split(",").map(f => f.toUpperCase()).join(", ")'
```

### 🔀 Conditional Operations
Use ternary operators for conditional processing.

**Basic Ternary:**
```bash
# Conditional formatting
echo "test" | js '.includes("t") ? .toUpperCase() : .toLowerCase()'

# Conditional coloring
echo "error message" | js '.includes("error") ? .color("red") : .color("white")'

# Conditional filtering (null = suppress output)
echo "test" | js '.includes("x") ? .toUpperCase() : null'
```

**Advanced Ternary:**
```bash
# Complex conditions
echo "filename.js" | js '.split(".").pop() == "js" ? .color("yellow") : .color("white")'

# Nested operations
echo "data" | js '.includes("a") ? .charAt(0).toUpperCase() + .substring(1) : .toUpperCase()'
```

### 🎨 Formatting Operations
Add color and formatting to your outputs.

**Basic Colors:**
```bash
echo "warning" | js '.color("yellow")'
echo "error" | js '.color("bgRed").color("white")'
```

**Conditional Formatting:**
```bash
# Format based on content
ls -la | js '.includes("js") ? .color("yellow") : .includes("py") ? .color("blue") : .color("white")'
```

**Combining Formatting:**
```bash
echo "message" | js '.toUpperCase().color("green").concat(" (processed)")'
```

### 🧱 Array Operations
Process parts of strings as arrays.

**Basic Array Ops:**
```bash
# Process CSV-style data
echo "name,age,city" | js '.split(",").get(0).toUpperCase()'

# Extract specific parts
ls -l | js '.split(" ").pop()'  # Get filename
```

**Advanced Array Ops:**
```bash
# Filter array elements
echo "a,b,c,d,e" | js '.split(",").filter(x => x != "c").join(",")'

# Transform array elements
echo "a,b,c" | js '.split(",").map(x => x.toUpperCase()).join(",")'
```

### 🧩 Chain Composition
Use saved chains for reusable operations.

**Save Common Chains:**
```bash
# Save a formatting pattern
js -s upper-color '.toUpperCase().color("red")'

# Save conditional logic  
js -s js-files '.includes(".js") ? .split(" ").pop().pre("JS: ").color("yellow") : null'
```

**Use Saved Chains:**
```bash
echo "hello world" | js '$upper-color'
ls -la | js '$js-files'
```

### 🏗️ Common Patterns

**File Processing:**
```bash
# Extract and format filenames
ls -la | js '.split(" ").pop().pre("File: ").suf(" (exists)").color("green")'

# Filter and process specific file types
find . -name "*.js" | js '.substr(2).toUpperCase().color("yellow")'  # Remove leading ./
```

**Log Analysis:**
```bash
# Highlight different log levels
tail -f app.log | js '.includes("ERROR") ? .color("red") : .includes("WARN") ? .color("yellow") : .color("gray")'

# Extract timestamps and format messages
grep "2023-" logs.txt | js '.highlightRegex(/\\d{4}-\\d{2}-\\d{2}/, "blue")'
```

**Data Processing:**
```bash
# Process CSV-like data
echo "name,age,city" | js '.split(",").map(part => part.trim().toUpperCase()).join(" | ")'

# Extract specific fields
ps aux | js '.split(" ").filter(part => part.length > 0).get(10).color("cyan")'  # PID
```

### 🛠️ Troubleshooting Patterns

**Debugging Chains:**
```bash
# Break complex chains into steps
# Instead of: echo "data" | js '.complex().chain().with().many().parts()'
# Try: echo "data" | js '.complex()' | js '.chain()' | js '.with()' ... 
```

**Testing Operations:**
```bash
# Test simple operations first
echo "test" | js '.length'          # Check if operation works
echo "test" | js '.toUpperCase()'   # Verify basic functionality

# Then combine operations
echo "test" | js '.length.toString().toUpperCase()'
```

### 🚀 Performance Patterns

**Efficient Processing:**
```bash
# Filter early, transform late
# Good: ls -la | grep "js" | js '.color("yellow")'
# Avoid: ls -la | js '.includes("js") ? .color("yellow") : .color("gray")' | grep -v "gray"
```

**Minimize Operations:**
```bash
# Combine similar operations
# Good: echo "test" | js '.toUpperCase().color("red")'
# Instead of: echo "test" | js '.toUpperCase()' | js '.color("red")'
```

These patterns will help you solve common text processing tasks efficiently!