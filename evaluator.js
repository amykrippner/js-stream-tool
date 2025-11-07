const { addExtensions, colors, color, last, pop, first, compact, get } = require('./extensions');

function evaluateChain(currentValue, chain) {
    // Check if the chain contains a ternary operator
    if (chain.includes('?') && chain.includes(':')) {
        // For ternary expressions, we evaluate them as complete expressions
        // The user should write something like: .includes("test") ? .toUpperCase() : .toLowerCase()
        // We need to replace the standalone dots in the ternary with proper currentValue references
        const processedChain = chain
            .replace(/\s\?\s\./g, ' ? currentValue.')
            .replace(/\s:\s\./g, ' : currentValue.')
            .replace(/^\./, 'currentValue.'); // Replace the initial dot
        
        return eval(`
            (function() {
                const fs = require('fs');
                const path = require('path');
                
                addExtensions(); // Add all extensions to prototypes
                
                // Make color function available globally for more complex operations
                const color = function(text, colorName) {
                    const colorCode = colors[colorName] || colors.reset;
                    return \`\${colorCode}\${text}\${colors.reset}\`;
                };
                
                return (${processedChain});
            })()
        `);
    } else {
        // For simple method chains (original behavior)
        return eval(`
            (function() {
                const fs = require('fs');
                const path = require('path');
                
                addExtensions(); // Add all extensions to prototypes
                
                // Make color function available globally for more complex operations
                const color = function(text, colorName) {
                    const colorCode = colors[colorName] || colors.reset;
                    return \`\${colorCode}\${text}\${colors.reset}\`;
                };
                
                return currentValue${chain};
            })()
        `);
    }
}

module.exports = { evaluateChain };