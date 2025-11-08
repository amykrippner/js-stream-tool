#!/usr/bin/env node

const { spawn } = require('child_process');

// Test suite for long chained operations
const tests = [
    // Complex deep chain tests
    {
        name: "Deep chain with multiple operations",
        input: "apple,banana,grape,orange,kiwi",
        chain: ".split(',').get(2).toUpperCase().color('cyan').concat(' - ').concat(color('added', 'magenta'))",
        expected: "GRAPE - added"  // with color codes around 'GRAPE' and 'added'
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
    }
];

module.exports = { tests, runTest };

function runTest(test) {
    return new Promise((resolve, reject) => {
        const child = spawn('echo', [test.input]);
        const jsProcess = spawn('node', ['../js.js', test.chain], {
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