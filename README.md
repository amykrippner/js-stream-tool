# 🎨 js - JavaScript Stream Tool 

**Transform your terminal into a JavaScript playground!**  
*Powerful text processing with method chaining, colors, and JavaScript magic*

---

## 🚀 Overview

**js** is a command-line utility that brings the full power of JavaScript's method chaining directly to your text streams. Pipe any text through **js** and unleash JavaScript's native array and string methods — with added superpowers!

Instead of memorizing complex sed/awk patterns, just write JavaScript you already know! Plus, we've supercharged it with custom methods and color capabilities.

---

## 🛠️ Installation

### Option 1: Global npm Installation (Recommended)
```bash
npm install -g js-stream-tool
```

### Option 2: Install Directly from GitHub
```bash
npm install -g sayore/js-stream-tool
```

### Option 3: Local Installation
```bash
npm install js-stream-tool
```

Then use with `npx`:
```bash
echo "hello world" | npx js '.toUpperCase()'
```

### Option 4: Manual Installation
```bash
git clone https://github.com/sayore/js-stream-tool.git
cd js-stream-tool
npm install
```

---

## ⚡ Usage

The syntax is simple and intuitive:

```bash
<command> | js '<chain>'
```

### ⚠️ Important Notes:
- **Your chain MUST start with a `.`** (like `.toUpperCase()`)
- **Use single quotes** for the chain to avoid shell interpretation
- **Use double quotes** inside for strings: `js '.includes("text")'`

---

## 🔥 Quick Examples

```bash
# Uppercase conversion
echo "hello world" | js '.toUpperCase()'

# Filter lines containing specific text
ls -l | js '.includes(".txt")'

# Add color to output
echo "error" | js '.color("red")'

# Combine operations
echo "hello world" | js '.toUpperCase().color("green")'

# Extract specific parts
echo "name,age,city" | js '.split(",").get(0)'
```

For more examples, see [EXAMPLES.md](./EXAMPLES.md).

---

## 🧰 Available Functions

### String Operations
- `.color(color)` - Colorize text
- `.prefix(text)`/`.pre(text)` - Add prefix
- `.suffix(text)`/`.suf(text)` - Add suffix
- `.toLength()` - Get string length

### Array Operations  
- `.first()` - Get first element
- `.last()`/`.pop()` - Get last element
- `.get(index)` - Get element at index
- `.compact()` - Remove empty elements

### Filtering Operations
- `.includes()` - Filter by content
- `.has(pattern)` - Filter by pattern (string or regex), returns original string or null
- `.not(pattern)` - Filter by absence of pattern (string or regex), returns original string or null
- Ternary: `.includes("a") ? .toUpperCase() : .toLowerCase()`

### Conditional Operations
- `.when()` - Conditional processing with else clause
- `.whenMatch()` - Pattern matching (deprecated in favor of colorIfMatch)
- `.colorIf()` - Conditional coloring
- `.colorIfMatch()` - Conditional coloring for pattern matching
- `.switch()` - Switch-like value matching
- `.switchCase()` - Object-based switch mapping
- `.is*()` - Validation functions

### Highlight Functions
- `.highlight()` - Highlight specific text
- `.highlightRegex()` - Highlight regex matches
- `.highlightFilenames()` - Highlight filenames
- `.highlightDates()` - Highlight dates

For complete function reference, see [FUNCTION_REFERENCE.md](./FUNCTION_REFERENCE.md).

---

## 📚 Understanding Differences

This tool works differently from regular JavaScript. Important behavioral differences, common pitfalls, and best practices are covered in [DIFFERENCES.md](./DIFFERENCES.md).

---

## 🎨 Colors & Formatting

Add vibrant ANSI colors to your output:

**Available Colors:**
- Basic: `red`, `green`, `blue`, `yellow`, `magenta`, `cyan`, `white`, etc.
- Bright: `brightRed`, `brightGreen`, etc.
- Background: `bgRed`, `bgBlue`, etc.
- Styles: `bold`, `italic`, `underline`, etc.

For color examples, see [EXAMPLES.md](./EXAMPLES.md).

---

## 🧩 Chain Composition

Save and reuse complex operations:

```bash
# Save a complex chain
js -s upper-red '.toUpperCase().color("red")'

# Use the saved chain
echo "hello" | js '$upper-red'
```

---

## 📈 Performance

js-stream-tool prioritizes flexibility over raw speed. For performance comparison with traditional Unix tools, see [PERFORMANCE.md](./PERFORMANCE.md).

---

## 📖 Usage Patterns

For common usage patterns and best practices, see [USAGE_GUIDE.md](./USAGE_GUIDE.md).

---

## 🧪 Testing

The project includes comprehensive tests across multiple test suites organized by functionality. Run tests with: `npm test`

---

## 🧩 Architecture

Built entirely with Node.js built-in modules, no external dependencies. For technical details, see [QWEN.md](./QWEN.md).

---

## 🤝 Contributing

Found a bug? Want to add a feature? PRs are welcome! 

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Changelog

See the full changelog in [CHANGELOG.md](./CHANGELOG.md).

---

## 📜 License

MIT License - Do whatever you want, but make it awesome!

---

## 💖 Acknowledgments

- Built with pure JavaScript magic
- Inspired by the need for simpler text processing
- Powered by the amazing Node.js ecosystem
- Enhanced with ANSI color codes for the modern terminal

**Made with 💥 and JavaScript!**

---
*js-stream-tool - Where JavaScript meets the terminal* 🚀