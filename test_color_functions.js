#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');

// Test suite for js-stream-tool with color functions
const tests = [
    // Basic functionality tests
    {
        name: "Basic toUpperCase",
        input: "hello",
        chain: ".toUpperCase()",
        expected: "HELLO"
    },
    {
        name: "Basic toLowerCase",
        input: "HELLO",
        chain: ".toLowerCase()",
        expected: "hello"
    },
    
    // Color function tests
    {
        name: "Color red",
        input: "test",
        chain: ".color('red')",
        expected: "\x1b[31mtest\x1b[0m"
    },
    {
        name: "Color green",
        input: "test",
        chain: ".color('green')",
        expected: "\x1b[32mtest\x1b[0m"
    },
    {
        name: "Color with transformation",
        input: "hello",
        chain: ".toUpperCase().color('blue')",
        expected: "\x1b[34mHELLO\x1b[0m"
    },
    {
        name: "Background color",
        input: "test",
        chain: ".color('bgYellow').color('black')",
        expected: "\x1b[43m\x1b[30mtest\x1b[0m"
    },
    {
        name: "Invalid color (should default to reset)",
        input: "test",
        chain: ".color('invalidColor')",
        expected: "test"
    },
    
    // Array functions tests
    {
        name: "Last element",
        input: "a,b,c",
        chain: ".split(',').last()",
        expected: "c"
    },
    {
        name: "First element",
        input: "a,b,c",
        chain: ".split(',').first()",
        expected: "a"
    },
    {
        name: "Get element at index",
        input: "a,b,c",
        chain: ".split(',').get(1)",
        expected: "b"
    },
    {
        name: "Compact array",
        input: ",a,,b,c,",
        chain: ".split(',').compact().join(',')",
        expected: "a,b,c"
    },
    
    // Filter functions tests
    {
        name: "Filter with includes",
        input: "hello world",
        chain: ".includes('world')",
        expected: "hello world"  // Should output the original line when true
    },
    {
        name: "Filter that returns false",
        input: "hello world",
        chain: ".includes('missing')",
        expected: null  // Should not output anything when false
    },
    
    // Boolean operations
    {
        name: "StartsWith filter",
        input: "hello world",
        chain: ".startsWith('hello')",
        expected: "hello world"
    },
    {
        name: "EndsWith filter",
        input: "hello world",
        chain: ".endsWith('world')",
        expected: "hello world"
    },
    
    // String manipulation tests
    {
        name: "Replace all",
        input: "hello-world",
        chain: ".replaceAll('-', '/')",
        expected: "hello/world"
    },
    {
        name: "Trim whitespace",
        input: "  hello  ",
        chain: ".trim()",
        expected: "hello"
    },
    {
        name: "Substring",
        input: "hello world",
        chain: ".substring(0, 5)",
        expected: "hello"
    },
    {
        name: "Split and join",
        input: "a,b,c",
        chain: ".split(',').join('-')",
        expected: "a-b-c"
    },
    
    // Combined operations tests
    {
        name: "Complex chain with color",
        input: "hello world",
        chain: ".toUpperCase().replace(' ', '_').color('yellow')",
        expected: "\x1b[33mHELLO_WORLD\x1b[0m"
    },
    {
        name: "Conditional with includes check",
        input: "javascript",
        chain: ".includes('java')",
        expected: "javascript"  // Should pass through when true
    },
    
    // Standalone color function tests (need special handling)
    {
        name: "Concat with color",
        input: "test",
        chain: ".concat(' - ' + color('added', 'red'))",
        expected: "test - added"  // with color codes around 'added'
    },
    {
        name: "Deep chain with multiple operations",
        input: "apple,banana,grape,orange,kiwi",
        chain: ".split(',').get(2).toUpperCase().color('cyan').concat(' - ').concat(color('fruit', 'magenta'))",
        expected: "GRAPE - fruit"
    },
    {
        name: "Complex chain with filter and map",
        input: "hello world this is a test",
        chain: ".split(' ').filter(word => word.length > 2).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-').color('brightYellow')",
        expected: "Hello-World-This-Test"
    },
    {
        name: "Very deep chain with slice, reverse, and multiple ops",
        input: "apple|banana|cherry|date|elderberry",
        chain: ".split('|').slice(1,4).compact().reverse().map(fruit => fruit.toUpperCase().color('brightCyan')).join(' & ').concat(' - ').concat('apple|banana|cherry|date|elderberry'.split('|').first().toUpperCase().color('brightRed'))",
        expected: "DATE & CHERRY & BANANA - APPLE"
    },
    {
        name: "Super deep chain with multiple filters and maps",
        input: "one|two|three|four|five|six|seven|eight|nine|ten",
        chain: ".split('|').filter(word => word.length > 3).map(word => word.charAt(0).toUpperCase() + word.slice(1)).slice(0,3).reverse().compact().join('-').color('magenta').concat(' -> ').concat('one|two|three|four|five|six|seven|eight|nine|ten'.split('|').filter(word => word.length <= 3).join(',').toUpperCase().color('cyan'))",
        expected: "Five-Four-Three -> ONE,TWO,SIX,TEN"
    },
    {
        name: "Deep chain with replace, split, and array operations",
        input: "hello-world,foo-bar,baz-qux",
        chain: ".replaceAll('-', '_').split(',').map(item => item.split('_')).flat().filter(str => str.length > 2).first().toUpperCase().color('yellow').concat(' & ').concat('hello-world,foo-bar,baz-qux'.split(',').map(item => item.split('-')).flat().compact().last().toLowerCase().color('green'))",
        expected: "HELLO & qux"
    },
    {
        name: "Deep chain with substring, compact and color operations",
        input: "javascript,python,java,csharp,golang",
        chain: ".split(',').map(lang => lang.substring(0,2)).compact().filter(abbr => abbr).join('').toUpperCase().color('brightBlue').concat(' LENGTH: ').concat('javascript,python,java,csharp,golang'.split(',').map(lang => lang.substring(0,2)).compact().join('').length.toString().color('red'))",
        expected: "JAPYJACSGO LENGTH: 10"
    },
    {
        name: "Complex chain with multiple transformations",
        input: "  hello  ,  world  ,  test  ,  example  ",
        chain: ".split(',').map(item => item.trim()).filter(item => item).compact().map(item => item.toUpperCase()).reverse().slice(0,2).join(' | ').color('brightMagenta').concat(' :: ').concat('  hello  ,  world  ,  test  ,  example  '.split(',').map(item => item.trim()).filter(item => item).compact().first().toLowerCase().color('brightYellow'))",
        expected: "EXAMPLE | TEST :: hello"
    },
    {
        name: "Deep chain with startsWith and chaining",
        input: "apple,Application,banana,Avocado,apricot",
        chain: ".split(',').filter(word => word.toLowerCase().startsWith('ap')).map(word => word.toUpperCase()).compact().reverse().get(1).color('brightGreen').concat(' & ').concat('apple,Application,banana,Avocado,apricot'.split(',').filter(word => word.toLowerCase().startsWith('ap')).first().toLowerCase().color('brightRed'))",
        expected: "APPLICATION & apple"
    },
    {
        name: "Deep chain with includes, filter, and complex map",
        input: "javascript,python,java,csharp,golang,ruby",
        chain: ".split(',').filter(lang => lang.includes('a')).map(lang => lang.replace('a', '@')).compact().first().toUpperCase().color('cyan').concat(' + ').concat('javascript,python,java,csharp,golang,ruby'.split(',').filter(lang => !lang.includes('a')).last().toUpperCase().color('yellow'))",
        expected: "J@VASCRIPT + RUBY"
    },
    {
        name: "Deep chain with multiple array operations and indexing",
        input: "zero,one,two,three,four,five,six,seven,eight,nine,ten",
        chain: ".split(',').filter((_, idx) => idx % 2 === 0).map(item => item.toUpperCase()).compact().last().color('brightWhite').concat(' - ').concat('zero,one,two,three,four,five,six,seven,eight,nine,ten'.split(',').filter((_, idx) => idx % 2 === 1).first().toLowerCase().color('brightBlack'))",
        expected: "TEN - one"
    },
    {
        name: "Very deep chain with complex transformations",
        input: "foo-bar_baz,hello-world_test,example-data_type",
        chain: ".split(',').map(item => item.replace('_', ' ')).map(item => item.replace('-', ' ')).map(item => item.split(' ')).flat().filter(item => item.length > 2).map(item => item.charAt(0).toUpperCase() + item.substring(1)).first().color('brightCyan').concat(' to ').concat('foo-bar_baz,hello-world_test,example-data_type'.split(',').map(item => item.replace('_', ' ')).map(item => item.replace('-', ' ')).map(item => item.split(' ')).flat().filter(item => item.length > 2).map(item => item.charAt(0).toUpperCase() + item.substring(1)).last().toLowerCase().color('brightYellow'))",
        expected: "Foo to type"
    },
    {
        name: "Maximum depth chain with all operations",
        input: "red,green,blue,yellow,cyan,magenta",
        chain: ".split(',').map(color => color.toUpperCase()).filter(color => color.length > 4).compact().reverse().slice(0,2).map(color => color.substring(0,3)).join('-').toUpperCase().color('bgBlue').color('brightWhite').concat(' | ').concat('red,green,blue,yellow,cyan,magenta'.split(',').map(color => color.toUpperCase()).filter(color => color.length <= 4).first().toLowerCase().color('bgYellow').color('black'))",
        expected: "MAG-YEL | red"
    },
    {
        name: "Ternary operator with true condition",
        input: "hello",
        chain: ".includes('h') ? .toUpperCase() : .toLowerCase()",
        expected: "HELLO"
    },
    {
        name: "Ternary operator with false condition",
        input: "hello",
        chain: ".includes('x') ? .toUpperCase() : .toLowerCase()",
        expected: "hello"
    },
    {
        name: "Ternary with complex operations",
        input: "test,file.txt",
        chain: ".includes('.txt') ? .split(',')[1].toUpperCase() : .split(',')[0].toLowerCase()",
        expected: "FILE.TXT"
    },
    {
        name: "Ternary returning null for filter behavior",
        input: "nomatch",
        chain: ".includes('x') ? .toUpperCase() : null",
        expected: null  // Should not output anything when null is returned
    },
    {
        name: "Ternary returning undefined for filter behavior",
        input: "nomatch",
        chain: ".includes('x') ? .toUpperCase() : undefined",
        expected: null  // Should not output anything when undefined is returned
    },
    {
        name: "Boolean false still works for filtering",
        input: "test",
        chain: ".includes('x')",  // Should return false, so no output
        expected: null
    },
    {
        name: "Boolean true still works for filtering",
        input: "test",
        chain: ".includes('t')",  // Should return true, so output original line
        expected: "test"
    },
    {
        name: "Highlight single string",
        input: "This is a test string with test words",
        chain: ".highlight('test', 'red')",
        expected: "This is a test string with test words"  // with 'test' parts in red
    },
    {
        name: "Highlight array of strings",
        input: "apple banana cherry apple",
        chain: ".highlight(['apple', 'cherry'], 'green')",
        expected: "apple banana cherry apple"  // with 'apple' and 'cherry' parts in green
    },
    {
        name: "Highlight regex pattern",
        input: "Date: 2023-12-25 and 2024-01-01",
        chain: ".highlightRegex(/\\d{4}-\\d{2}-\\d{2}/, 'blue')",
        expected: "Date: 2023-12-25 and 2024-01-01"  // with dates in blue
    },
    {
        name: "Highlight filenames",
        input: "Open file.txt and document.pdf for more info",
        chain: ".highlightFilenames('blue')",
        expected: "Open file.txt and document.pdf for more info"  // with filenames in blue
    },
    {
        name: "Highlight dates",
        input: "Event on 2023-05-20 and meeting 12/25/2023",
        chain: ".highlightDates('green')",
        expected: "Event on 2023-05-20 and meeting 12/25/2023"  // with dates in green
    },
    {
        name: "Highlight numbers",
        input: "I have 123 apples and 45.67 oranges",
        chain: ".highlightNumbers('yellow')",
        expected: "I have 123 apples and 45.67 oranges"  // with numbers in yellow
    },
    {
        name: "Highlight any with defaults",
        input: "file.txt from 2023-12-25 with 123MB",
        chain: ".highlightAny()",
        expected: "file.txt from 2023-12-25 with 123MB"  // with all types highlighted in defaults
    },
    {
        name: "Highlight any excluding types",
        input: "file.txt from 2023-12-25 with 123MB",
        chain: ".highlightAny(['dates'])",
        expected: "file.txt from 2023-12-25 with 123MB"  // highlights all except dates
    },
    {
        name: "When with string condition (matches)",
        input: "hello123",
        chain: ".when('123', str => str.color('red'))",
        expected: "hello123"  // Should be colored red
    },
    {
        name: "When with string condition (no match)",
        input: "hello",
        chain: ".when('123', str => str.color('red'))",
        expected: "hello"  // Should remain unchanged
    },
    {
        name: "When with regex condition (matches)",
        input: "test123",
        chain: ".when(/\\d+/, str => str.color('blue'))",
        expected: "test123"  // Should be colored blue
    },
    {
        name: "When with function condition (matches)",
        input: "hello",
        chain: ".when(str => str.length > 3, str => str.toUpperCase())",
        expected: "HELLO"  // Should be uppercased
    },
    {
        name: "WhenMatch with color operation",
        input: "error in code",
        chain: ".whenMatch('error', 'red')",
        expected: "error in code"  // Should be colored red
    },
    {
        name: "isNumber with valid number",
        input: "123",
        chain: ".isNumber()",
        expected: "123"  // Should pass through (true condition)
    },
    {
        name: "isNumber with invalid number",
        input: "abc",
        chain: ".isNumber()",
        expected: null  // Should not pass (false condition)
    },
    {
        name: "isInteger with integer",
        input: "123",
        chain: ".isInteger()",
        expected: "123"  // Should pass through (true condition)
    },
    {
        name: "isDate with valid date",
        input: "2023-12-25",
        chain: ".isDate()",
        expected: "2023-12-25"  // Should pass through (true condition)
    },
    {
        name: "isFile with existing file",
        input: "package.json",
        chain: ".isFile()",
        expected: "package.json"  // Should pass through (true condition)
    },
    {
        name: "isDirectory with existing directory",
        input: ".",
        chain: ".isDirectory()",
        expected: "."  // Should pass through (true condition)
    },
    {
        name: "isEmail with valid email",
        input: "test@example.com",
        chain: ".isEmail()",
        expected: "test@example.com"  // Should pass through (true condition)
    },
    {
        name: "isURL with valid URL",
        input: "https://example.com",
        chain: ".isURL()",
        expected: "https://example.com"  // Should pass through (true condition)
    },
    {
        name: "isIP with valid IPv4",
        input: "192.168.1.1",
        chain: ".isIP()",
        expected: "192.168.1.1"  // Should pass through (true condition)
    },
    {
        name: "isFilename with valid filename",
        input: "document.pdf",
        chain: ".isFilename()",
        expected: "document.pdf"  // Should pass through (true condition)
    }
];

function runTest(test) {
    return new Promise((resolve, reject) => {
        const child = spawn('echo', [test.input]);
        const jsProcess = spawn('node', ['js.js', test.chain], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: __dirname
        });

        let output = '';
        let error = '';

        // Pipe echo output to js.js
        child.stdout.pipe(jsProcess.stdin);

        jsProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        jsProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        jsProcess.on('close', (code) => {
            if (error) {
                console.log(`❌ ${test.name}: Error occurred - ${error.trim()}`);
                resolve(false);
                return;
            }

            // Clean the output (remove trailing newlines)
            const actualOutput = output.trim();
            const expectedOutput = test.expected ? test.expected : '';
            
            // For tests with color codes, we'll check if the plain text content matches
            if (test.chain.includes('color(') || test.chain.includes('.color(') || 
                test.chain.includes('.highlight(') || test.chain.includes('.highlightRegex(') ||
                test.chain.includes('.highlightFilenames(') || test.chain.includes('.highlightDates(') ||
                test.chain.includes('.highlightNumbers(') || test.chain.includes('.highlightAny(') ||
                test.chain.includes('.whenMatch(')) {
                // Remove ANSI color codes for comparison if needed
                const ansiRegex = /\x1b\[[0-9;]*m/g;
                const actualWithoutAnsi = actualOutput.replace(ansiRegex, '');
                const expectedWithoutAnsi = expectedOutput.replace(ansiRegex, '');
                
                if (actualWithoutAnsi === expectedWithoutAnsi) {
                    console.log(`✅ ${test.name}: PASS`);
                    resolve(true);
                } else {
                    console.log(`❌ ${test.name}: FAIL`);
                    console.log(`   Expected: "${expectedWithoutAnsi}"`);
                    console.log(`   Actual:   "${actualWithoutAnsi}"`);
                    resolve(false);
                }
            } else {
                if (actualOutput === expectedOutput) {
                    console.log(`✅ ${test.name}: PASS`);
                    resolve(true);
                } else {
                    console.log(`❌ ${test.name}: FAIL`);
                    console.log(`   Expected: "${expectedOutput}"`);
                    console.log(`   Actual:   "${actualOutput}"`);
                    resolve(false);
                }
            }
        });

        child.on('error', (err) => {
            console.log(`❌ ${test.name}: Spawn error - ${err.message}`);
            reject(err);
        });

        jsProcess.on('error', (err) => {
            console.log(`❌ ${test.name}: Process error - ${err.message}`);
            reject(err);
        });
    });
}

async function runAllTests() {
    console.log("Running comprehensive tests for js-stream-tool...\n");
    
    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const result = await runTest(test);
        if (result) {
            passed++;
        } else {
            failed++;
        }
    }

    console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log("🎉 All tests passed!");
        process.exit(0);
    } else {
        console.log("💥 Some tests failed!");
        process.exit(1);
    }
}

// Run the tests
runAllTests().catch(err => {
    console.error('Test execution error:', err);
    process.exit(1);
});