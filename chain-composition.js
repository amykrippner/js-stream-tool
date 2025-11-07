const fs = require('fs');
const path = require('path');

// Configuration directory
const CONFIG_DIR = path.join(require('os').homedir(), '.js-stream-tool');
const CHAINS_FILE = path.join(CONFIG_DIR, 'saved-chains.json');

// Create config directory if it doesn't exist
if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

function handleChainComposition(args) {
    // Handle save/retrieve functionality
    if (args[0] === '-s' || args[0] === '--save') {
        if (args.length < 3) {
            console.error('Error: Please provide a name and a chain to save.\nUsage: js -s <name> <chain>');
            process.exit(1);
        }
        
        const name = args[1];
        const chainToSave = args.slice(2).join(' ');
        
        // Load existing saved chains
        let savedChains = {};
        if (fs.existsSync(CHAINS_FILE)) {
            try {
                savedChains = JSON.parse(fs.readFileSync(CHAINS_FILE, 'utf8'));
            } catch (e) {
                console.error('Error reading saved chains file:', e.message);
            }
        }
        
        // Save the new chain
        savedChains[name] = chainToSave;
        fs.writeFileSync(CHAINS_FILE, JSON.stringify(savedChains, null, 2));
        
        console.log(`Chain saved as "${name}": ${chainToSave}`);
        process.exit(0);
    } else if (args[0] && args[0].startsWith('$')) {
        // Retrieve and use a saved chain
        const fullArg = args.join(' ');
        
        // Handle potential concatenation syntax like: js '$chain' + "text" or js '$chain' + 'text'
        const chainMatch = fullArg.match(/^\$([a-zA-Z0-9_-]+)(.*)/);
        
        if (!chainMatch) {
            console.error(`Error: Invalid saved chain format. Use $\{name} where name contains only letters, numbers, hyphens, and underscores.`);
            process.exit(1);
        }
        
        const name = chainMatch[1];
        const remaining = chainMatch[2].trim();
        
        // Load saved chains
        if (!fs.existsSync(CHAINS_FILE)) {
            console.error(`Error: No saved chains found. Use 'js -s <name> <chain>' to save a chain first.`);
            process.exit(1);
        }
        
        let savedChains;
        try {
            savedChains = JSON.parse(fs.readFileSync(CHAINS_FILE, 'utf8'));
        } catch (e) {
            console.error('Error reading saved chains:', e.message);
            process.exit(1);
        }
        
        if (!savedChains[name]) {
            console.error(`Error: No chain saved with name "${name}".`);
            console.log('Available saved chains:', Object.keys(savedChains).join(', '));
            process.exit(1);
        }
        
        let chain = savedChains[name];
        
        // If there's a concatenation operation after the saved chain, we need to handle it differently
        // The command line parsing makes this complex, so we'll need to handle this in the evaluation
        // Check if there's concatenation syntax: + "text" or + 'text'
        if (remaining && remaining.startsWith('+')) {
            // Extract the text to concatenate
            const concatMatch = remaining.match(/^\+\s*(['"]?)(.*?)\1\s*$/);
            if (concatMatch) {
                const textToAppend = concatMatch[2];
                // This is a special case that needs to build a new chain expression
                chain = `${chain}.concat("${textToAppend}")`;
            } else {
                // If the remaining text doesn't match the simple concatenation pattern,
                // we'll need to treat it differently or show an error
                console.error(`Error: Invalid concatenation syntax. Expected: $\{name} + "text"`);
                process.exit(1);
            }
        }
        
        return chain;
    } else {
        // Normal chain processing
        return args.join(' ').replace(/^['"]|['"]$/g, '');
    }
}

module.exports = { handleChainComposition };