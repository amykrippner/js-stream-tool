#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Main test runner
async function runAllTests() {
    console.log("Running comprehensive tests for js-stream-tool...\n");
    
    const testFiles = fs.readdirSync(__dirname)
        .filter(file => file.endsWith('.test.js') && file !== 'run_tests.js');
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    for (const testFile of testFiles) {
        console.log(`\n🧪 Running ${testFile}...`);
        console.log('---');
        
        try {
            const testModule = require(path.join(__dirname, testFile));
            const tests = testModule.tests;
            const runTest = testModule.runTest;
            
            for (const test of tests) {
                totalTests++;
                const result = await runTest(test);
                if (result) {
                    passedTests++;
                } else {
                    failedTests++;
                }
            }
        } catch (error) {
            console.error(`❌ Error running ${testFile}: ${error.message}`);
            failedTests += tests ? tests.length : 0;
            totalTests += tests ? tests.length : 0;
        }
    }
    
    console.log(`\n📊 Test Results: ${passedTests} passed, ${failedTests} failed, ${totalTests} total`);
    
    if (failedTests === 0) {
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