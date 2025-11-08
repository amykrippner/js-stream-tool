# js-stream-tool: Behavioral Differences & Limitations

This document explains the key behavioral differences between JavaScript in js-stream-tool and regular JavaScript, as well as important limitations and patterns to understand.

## 🔄 Core Processing Model

### Line-by-Line Processing
- **Normal JS**: Operates on entire data structures
- **js-stream-tool**: Processes each input line independently
- **Impact**: Each line is treated as a separate data point, not part of a larger collection

### Filter vs Transform Operations
- **Boolean Return Functions** (like `.includes()`, `.startsWith()`, `.isFile()`, etc.) act as **filters**:
  - `true` → Outputs the **original line** unchanged
  - `false` → Suppresses output (no line printed)
- **Value Return Functions** (like `.toUpperCase()`, `.color()`, `.toLength()`, etc.) act as **transforms**:
  - Outputs the **transformed value** instead of the original line

**Example:**
```bash
# Filter: outputs original line if true, nothing if false
echo "hello" | js '.includes("h")'        # → outputs: hello

# Transform: outputs transformed value
echo "hello" | js '.toUpperCase()'        # → outputs: HELLO
```

## ⚠️ Key Limitations

### Context Limitations
- **No global variables** - Variables defined in one line don't persist to the next
- **No closures** - Functions cannot access outer scope variables
- **No external functions** - Only built-in methods and the provided custom functions

### Eval Context
- **Evaluated in isolation** - Each line's transformation is independent
- **Limited scope access** - Only the current line's value is available as context
- **Security sandboxed** - Restricted access to Node.js internals for security

### Method Chaining Constraints
- **Must start with `.`** - All operations must be method chains (e.g., `.toUpperCase()`)
- **Cannot use function calls directly** - Syntax like `toUpperCase()` (without dot) won't work

## 🧠 Special Patterns

### Ternary Operations
```bash
# Works: Conditional operations
echo "hello" | js '.includes("h") ? .toUpperCase() : .toLowerCase()'
# → HELLO

# Result is a transform (not filter), so it outputs the resulting value
```

### Null/Undefined Filtering
- When a ternary returns `null` or `undefined`, it acts like a filter (suppresses output)
```bash
echo "hello" | js '.includes("x") ? .toUpperCase() : null'
# → (nothing output, because null suppresses the line)
```

### String vs Array Operations
- Operations like `.split()` return arrays but subsequent operations depend on the result type
- `.pop()`, `.first()`, `.get()`, `.compact()` work on arrays
- To continue with string operations after array operations, you get a string back

## ❗ Common Pitfalls

### Expecting Array Behavior
- Input lines are strings, not arrays by default
- Need to use `.split()` first to work with individual parts
```bash
# Wrong: expecting string to behave as array
echo "a b c" | js '.pop()'  # ❌ Error - strings don't have pop()

# Right: convert to array first
echo "a b c" | js '.split(" ").pop()'  # ✅ Works - outputs: c
```

### Confusing Filter vs Transform
- Using `.includes()` thinking it returns the value - it doesn't, it filters lines
- Using `.color()` thinking it modifies original - it transforms the value

### Method Order Matters
- Operations are applied sequentially
- Some operations convert between types (string → array → string)

## 🎯 Best Practices

1. **Think of each line independently** - No cross-line state
2. **Understand return types** - Know if your operation filters or transforms  
3. **Use `.includes()` and boolean methods for filtering** - They control whether lines appear
4. **Use transform methods for value changes** - They change what gets output
5. **Use ternary for conditional logic** - Great for complex operations
6. **Chain composition with `-s` and `$name` for complex operations** - Reusable patterns

## 📋 Quick Reference

| Operation Type | Purpose | Example | Output |
|---------------|---------|---------|---------|
| Filter | Control which lines appear | `.includes("test")` | Original line or nothing |
| Transform | Change the output value | `.toUpperCase()` | Transformed value |
| Ternary | Conditional transform | `? .op1() : .op2()` | Result of chosen operation |
| Chain Composition | Reusable patterns | `-s name 'chain'` | Save/reuse operation sets |

Understanding these differences will make your experience with js-stream-tool much smoother!