#!/usr/bin/env node

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Generate test data and write to a temporary file
function generateTestData(size) {
    const lines = [];
    for (let i = 0; i < size; i++) {
        lines.push(`line${i}-data-${Math.random().toString(36).substring(2, 15)}`);
    }
    return lines.join('\n');
}

// Write test data to a temporary file and return the path
function createTempFile(data) {
    const tempPath = path.join(os.tmpdir(), `js_benchmark_${Date.now()}.txt`);
    fs.writeFileSync(tempPath, data);
    return tempPath;
}

// Run a command and measure execution time
function runBenchmark(command, inputFile, name) {
    const start = process.hrtime.bigint();
    
    const result = spawnSync('bash', ['-c', `cat "${inputFile}" | ${command}`], {
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 1024 * 1024 * 50  // 50MB
    });
    
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    
    // Clean up - remove temp file if it exists
    try {
        if (inputFile && fs.existsSync(inputFile)) {
            fs.unlinkSync(inputFile);
        }
    } catch (e) {
        // Ignore cleanup errors
    }
    
    if (result.status !== 0) {
        const error = result.stderr ? result.stderr.toString() : 'Unknown error';
        console.log(`${name}: ❌ FAILED - ${error.substring(0, 100)}...`); // Truncate long errors
        return null;
    }
    
    return {
        duration,
        output: result.stdout.toString()
    };
}

// Create and run benchmarks using temp files for larger data sets
function runBenchmarkWithFile(benchmarkName, jsChain, sedCommand, awkCommand, description, size, testData) {
    console.log(`\n⏱️  ${benchmarkName}: ${description}`);
    
    const tempFile = createTempFile(testData);
    
    // Test js-stream-tool
    const jsResult = runBenchmark(`node js.js '${jsChain}'`, tempFile, 'js');
    
    // Create a new temp file for each command to ensure fairness
    const tempFile2 = createTempFile(testData);
    const sedResult = runBenchmark(sedCommand, tempFile2, 'sed');
    
    const tempFile3 = createTempFile(testData);
    const awkResult = runBenchmark(awkCommand, tempFile3, 'awk');
    
    // Compare performance if all tests passed
    if (jsResult && sedResult && awkResult) {
        console.log(`   🟦 js:     ${jsResult.duration.toFixed(2)}ms`);
        console.log(`   🟨 sed:    ${sedResult.duration.toFixed(2)}ms`);
        console.log(`   🟧 awk:    ${awkResult.duration.toFixed(2)}ms`);
        
        // Find fastest
        const fastest = Math.min(jsResult.duration, sedResult.duration, awkResult.duration);
        
        if (fastest === jsResult.duration) {
            console.log(`   🏆 js is fastest!`);
        } else if (fastest === sedResult.duration) {
            console.log(`   🏆 sed is fastest!`);
        } else {
            console.log(`   🏆 awk is fastest!`);
        }
    } else {
        console.log(`   Performance comparison skipped due to failure in one or more tools`);
    }
}

// Define benchmark tests
const benchmarks = [
    {
        name: 'Uppercase Transformation',
        jsChain: '.toUpperCase()',
        sedCommand: 'sed "s/.*/\\U&/"',
        awkCommand: 'awk \'{print toupper($0)}\'',
        description: 'Convert all text to uppercase'
    },
    {
        name: 'Filter Lines with Pattern',
        jsChain: '.includes("test")',
        sedCommand: 'sed -n "/test/p"',
        awkCommand: 'awk "/test/"',
        description: 'Keep only lines containing "test"'
    },
    {
        name: 'Split and Get First Field',
        jsChain: '.split(",")[0]',
        sedCommand: 'sed "s/,.*//"',  // This assumes comma is the first separator
        awkCommand: 'awk -F"," \'{print $1}\'',
        description: 'Get first field after splitting by comma'
    },
    {
        name: 'Replace Pattern',
        jsChain: '.replaceAll("old", "new")',
        sedCommand: 'sed "s/old/new/g"',
        awkCommand: 'awk \'{gsub(/old/, "new"); print}\'',
        description: 'Replace all occurrences of "old" with "new"'
    },
    {
        name: 'Length Filter',
        jsChain: '.length > 10',
        sedCommand: 'sed -n "/^.\{11,\}$/p"',
        awkCommand: 'awk "length > 10"',
        description: 'Keep only lines longer than 10 characters'
    }
];

// Test sizes - reduce large size to prevent timeout issues
const sizes = [
    { name: 'Small (1K lines)', size: 1000 },
    { name: 'Medium (5K lines)', size: 5000 },  
    // Skip large for now due to potential timeout issues
];

console.log('🚀 js-stream-tool Performance Benchmark');
console.log('========================================');

for (const size of sizes) {
    console.log(`\n📊 ${size.name} Dataset:`);
    console.log('----------------------------------------');
    
    const testData = generateTestData(size.size);
    
    for (const benchmark of benchmarks) {
        runBenchmarkWithFile(
            benchmark.name,
            benchmark.jsChain,
            benchmark.sedCommand,
            benchmark.awkCommand,
            benchmark.description,
            size.size,
            testData
        );
    }
}

// Additional comparison: Simple grep vs js filter
console.log(`\n\n🧩 Simple Filter Comparison (grep vs js)`);
console.log('-----------------------------------------');

for (const size of sizes) {
    console.log(`\n${size.name}:`);
    
    // Create test data with some lines containing "test"
    let testData = '';
    for (let i = 0; i < size.size; i++) {
        if (i % 3 === 0) {  // Every third line contains "test"
            testData += `This is a test line ${i}\n`;
        } else {
            testData += `Regular line ${i}\n`;
        }
    }
    
    const tempFile = createTempFile(testData);
    const jsResult = runBenchmark('node js.js \'.includes("test")\'', tempFile, 'js');
    
    const tempFile2 = createTempFile(testData);
    const grepResult = runBenchmark('grep "test"', tempFile2, 'grep');
    
    if (jsResult && grepResult) {
        console.log(`   🟦 js (includes): ${jsResult.duration.toFixed(2)}ms`);
        console.log(`   🟩 grep:         ${grepResult.duration.toFixed(2)}ms`);
        
        if (jsResult.duration < grepResult.duration) {
            console.log(`   🏆 js is faster!`);
        } else {
            console.log(`   🏆 grep is faster!`);
        }
    }
}

console.log('\n✅ Benchmark complete!');
console.log('\n💡 Note: Performance may vary depending on system, Node.js version,');
console.log('   and specific use case. js-stream-tool offers JavaScript flexibility');
console.log('   at the cost of some raw speed compared to specialized tools like sed/awk.');
console.log('\n   Speed: sed/awk/grep > js-stream-tool');
console.log('   Flexibility: js-stream-tool > sed/awk/grep');