#!/usr/bin/env node

// Test the highlighting functions directly
const { addExtensions } = require('./extensions');

// Add extensions to String prototype
addExtensions();

// Test string
const testString = "This is a test string with test words";

// Apply highlight function
const result = testString.highlight("test", "red");

console.log("Original:", JSON.stringify(testString));
console.log("Result:", JSON.stringify(result));
console.log("Length - Original:", testString.length);
console.log("Length - Result:", result.length);

// Check if original string is contained in result
console.log("Contains original:", result.includes(testString.replace(/test/g, '\x1b[31mtest\x1b[0m')));

// Let's also test a simple color function for comparison
const colorResult = testString.replace(/test/, 'test').color("red");
console.log("Color result:", JSON.stringify(colorResult));

// Test what .color() does to the full string
const fullColorResult = testString.color("red");
console.log("Full color result:", JSON.stringify(fullColorResult));