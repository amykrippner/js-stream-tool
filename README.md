# 🎨 js - JavaScript Stream Tool 

**Transform your terminal into a JavaScript playground!**  
*Powerful text processing with method chaining, colors, and JavaScript magic*

---

## 🚀 What is js-stream-tool?

**js** is a command-line utility that brings the full power of JavaScript's method chaining directly to your text streams. Pipe any text through **js** and unleash JavaScript's native array and string methods — with added superpowers!

Instead of memorizing complex sed/awk patterns, just write JavaScript you already know! Plus, we've supercharged it with custom methods and color capabilities.

---

## 🛠️ Installation

### Option 1: Global npm Installation (Recommended)
Install directly from npm:
```bash
npm install -g js-stream-tool
```

Or install directly from GitHub:
```bash
npm install -g sayore/js-stream-tool
```

## 🌐 GitHub Repository
Find the source code and contribute at: [github.com/sayore/js-stream-tool](https://github.com/sayore/js-stream-tool)

After installation, the `js` command will be available system-wide!

### Option 2: Local Installation
Install as a local dependency:
```bash
npm install js-stream-tool
```

Then use with npx:
```bash
echo "hello world" | npx js '.toUpperCase()'
```

### Option 3: Manual Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/js-stream-tool.git
   cd js-stream-tool
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Make it globally available (optional):**
   ```bash
   # Add to your PATH or create a symlink
   sudo ln -s $(pwd)/js.js /usr/local/bin/js
   # Or alias it in your .bashrc/.zshrc
   alias js='node $(pwd)/js.js'
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

## 🌈 Color Functions (NEW!)

Add vibrant colors to your output! Use the `.color()` method or the standalone `color()` function:

### String Method:
```bash
echo "Hello World" | js '.color("red")'
```

### Combined Operations:
```bash
echo "hello world" | js '.toUpperCase().color("blue")'
```

### Background Colors:
```bash
echo "Warning" | js '.color("bgYellow").color("black")'
```

### Available Colors:
- **Basic:** `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`
- **Bright:** `brightBlack`, `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite` 
- **Background:** `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`
- **Styles:** `bold`, `dim`, `italic`, `underline`, `blink`, `reverse`, `hidden`, `strikethrough`

---

## 🧪 Examples That'll Blow Your Mind

### 📁 Filter & Extract Filenames
```bash
ls -l | js '.includes(".txt").split(" ").pop()'
```
*Filter lines containing ".txt" and get the filename*

### 🔥 Transform & Uppercase
```bash
echo "2025-11-21" | js '.replaceAll("-","/").toUpperCase()'
```
*Replace dashes with slashes and uppercase: `2025/11/21`*

### 🎯 Advanced Filtering
```bash
cat config.ini | js '.trim().startsWith("#")==false'
```
*Remove comment lines (those starting with #)*

### 🌈 Color Your Output
```bash
ls | js '.includes("js").toUpperCase().color("green")'
```
*Show only .js files, uppercase, in green*

### 🧮 Complex Data Processing
```bash
echo "apple,banana,cherry,date" | js '.split(",").filter(fruit => fruit.length > 4).map(fruit => fruit.toUpperCase()).join("-")'
```
*Filters long-named fruits and joins with dashes: `APPLE-BANANA-CHERRY`*

### 🌈 Colored Complex Processing
```bash
echo "red,green,blue,yellow" | js '.split(",").filter(color => color.length > 3).map(color => color.toUpperCase().color("brightCyan")).join(" | ")'
```
*Filters and colors long color names: Colored "GREEN | YELLOW"*

### 🎨 Multi-Color Output
```bash
echo "data" | js '.concat(" - ").concat(color("processed", "green")).concat(" at ").concat(new Date().toString().color("yellow"))'
```
*Combine colored elements with timestamps*

---

## 🧰 Custom Functions Added

### Array Extensions
- **`.last()` / `.pop()`** - Returns the last element of an array
- **`.first()`** - Returns the first element of an array  
- **`.compact()`** - Removes empty strings from an array
- **`.get(index)`** - Returns the element at a specific index

### Color Functions
- **`.color(colorName)`** - Colors the text using ANSI color codes
- **`color(text, colorName)`** - Standalone function to color text

---

## 🧪 Comprehensive Test Suite

The project includes a robust test suite with **34+ tests** covering:
- Basic string operations
- Array method chaining
- Color functions with various color options
- Complex deep chains with multiple operations
- Error handling and edge cases
- Integration of multiple features

Run tests with: `npm test`

---

## 📊 Performance Analysis

While **js-stream-tool** prioritizes flexibility and ease of use over raw speed, here's how it compares to traditional Unix tools:

| Operation | js-stream-tool | sed | awk | grep |
|-----------|----------------|-----|-----|------|
| Uppercase (1K lines) | ~45ms | ~3ms | ~2ms | N/A |
| Filter Pattern (1K lines) | ~31ms | ~2.5ms | ~2.4ms | ~2.7ms |
| Split & Get Field (1K lines) | ~41ms | ~3ms | ~2.6ms | N/A |
| Replace Pattern (1K lines) | ~39ms | ~2.6ms | ~2.4ms | N/A |
| Length Filter (1K lines) | ~43ms | ~2.4ms | ~2.3ms | N/A |

### Performance Summary:
- **Unix tools (sed/awk/grep)** are **10-30x faster** than js-stream-tool
- **js-stream-tool** provides full JavaScript expressiveness at a performance cost
- **Best use case**: Development, prototyping, and complex operations requiring JavaScript logic
- **Not ideal for**: Performance-critical production pipelines with large datasets

While traditional Unix tools are implemented in highly optimized C code, js-stream-tool runs JavaScript through Node.js with eval. The trade-off is between speed and the ability to use the full power of JavaScript for text processing.

---

## 🤝 Contributing

Found a bug? Want to add a feature? PRs are welcome! 

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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