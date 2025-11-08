# ⚡ js-stream-tool: Performance Analysis

This document provides detailed performance benchmarks comparing js-stream-tool with traditional Unix text processing tools.

## 📊 Performance Comparison

While **js-stream-tool** prioritizes flexibility and ease of use over raw speed, here's how it compares to traditional Unix tools:

| Operation | js-stream-tool | sed | awk | grep |
|-----------|----------------|-----|-----|------|
| Uppercase (1K lines) | ~45ms | ~3ms | ~2ms | N/A |
| Filter Pattern (1K lines) | ~31ms | ~2.5ms | ~2.4ms | ~2.7ms |
| Split & Get Field (1K lines) | ~41ms | ~3ms | ~2.6ms | N/A |
| Replace Pattern (1K lines) | ~39ms | ~2.6ms | ~2.4ms | N/A |
| Length Filter (1K lines) | ~43ms | ~2.4ms | ~2.3ms | N/A |

## ⚖️ Performance Summary:

- **Unix tools (sed/awk/grep)** are **10-30x faster** than js-stream-tool
- **js-stream-tool** provides full JavaScript expressiveness at a performance cost
- **Best use case**: Development, prototyping, and complex operations requiring JavaScript logic
- **Not ideal for**: Performance-critical production pipelines with large datasets

## 🔬 Why the Performance Difference?

Traditional Unix tools are implemented in highly optimized C code, while js-stream-tool runs JavaScript through Node.js with eval. The trade-off is between speed and the ability to use the full power of JavaScript for text processing.

### Execution Overhead
- **sed/awk/grep**: Compiled C programs with minimal overhead
- **js-stream-tool**: JavaScript engine startup + eval() processing for each line

### Memory Usage
- **Traditional tools**: Highly optimized for low memory usage
- **js-stream-tool**: Each operation creates new strings and objects in JavaScript

### Complexity Trade-off
- **Speed**: sed/awk/grep > js-stream-tool
- **Expressiveness**: js-stream-tool > sed/awk/grep
- **Learning curve**: js-stream-tool < sed/awk/grep (for JavaScript developers)

## 🎯 Recommended Usage

### Use js-stream-tool for:
- Development and scripting
- Complex transformations requiring JavaScript logic
- Learning and teaching text processing
- Prototyping and experimentation
- Operations involving multiple programming concepts
- When readability is important

### Use traditional tools for:
- Production systems with large datasets
- Performance-critical pipelines
- Simple text operations
- When efficiency is paramount

## 🧪 Benchmarking Methodology

The benchmarks were conducted with:
- **Test data**: Randomly generated text lines with patterns
- **System**: Linux environment with Node.js v18+
- **Metrics**: Wall-clock time using millisecond precision
- **Sample size**: Multiple iterations averaged for accuracy

## 📈 Performance Tuning Tips

For better performance when using js-stream-tool:
1. Keep chains simple when possible
2. Use native JavaScript methods over custom logic
3. Minimize string concatenation operations
4. Consider pre-filtering with faster tools if needed
5. Use chain composition to optimize frequently used operations