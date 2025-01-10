const fs = require('fs').promises;
const path = require('path');

async function concatenateSourceFiles(rootDir, outputFile) {
    // List of important file patterns to include
    const importantFiles = [
        // Source files
        '.js', '.jsx', '.ts', '.tsx', '.css', '.scss',
        // Config files
        'tailwind.config.js',
        'postcss.config.js',
        'package.json',
        'tsconfig.json',
        'vite.config.js',
        'next.config.js',
        '.env.example',
        '.babelrc',
        // Style files
        'global.css',
        'tailwind.css',
        'styles.css',
        // Documentation
        'README.md'
    ];

    let concatenatedContent = '';
    
    // Add project metadata
    const packageJson = await fs.readFile(path.join(rootDir, 'package.json'), 'utf8')
        .catch(() => '{ "name": "project", "version": "unknown" }');
    const pkg = JSON.parse(packageJson);
    
    concatenatedContent += `Project: ${pkg.name}\n`;
    concatenatedContent += `Version: ${pkg.version}\n`;
    concatenatedContent += `Generated: ${new Date().toISOString()}\n`;
    concatenatedContent += '='.repeat(80) + '\n\n';

    async function processDirectory(dir, isRoot = false) {
        const items = await fs.readdir(dir, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            
            // Skip node_modules, .git, and build directories
            if (item.isDirectory()) {
                if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item.name)) {
                    await processDirectory(fullPath);
                }
                continue;
            }
            
            // Check if file should be included
            const extension = path.extname(item.name);
            const shouldInclude = importantFiles.some(pattern => 
                pattern.startsWith('.') ? extension === pattern : item.name === pattern
            );
            
            if (shouldInclude) {
                try {
                    // Read file content
                    const content = await fs.readFile(fullPath, 'utf8');
                    
                    // Add file header
                    concatenatedContent += `File: ${path.relative(rootDir, fullPath)}\n`;
                    concatenatedContent += `${'='.repeat(80)}\n\n`;
                    concatenatedContent += content;
                    concatenatedContent += '\n\n';
                } catch (error) {
                    concatenatedContent += `Error reading file: ${fullPath}\n`;
                    concatenatedContent += `${error.message}\n\n`;
                }
            }
        }
    }

    try {
        // First process root directory for config files
        await processDirectory(rootDir, true);
        
        // Then process src directory if it exists
        const srcDir = path.join(rootDir, 'src');
        try {
            await fs.access(srcDir);
            await processDirectory(srcDir);
        } catch (error) {
            console.log('No src directory found, skipping...');
        }

        // Write concatenated content to output file
        await fs.writeFile(outputFile, concatenatedContent);
        console.log(`Successfully concatenated source files to ${outputFile}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
const projectRoot = '.';  // Current directory
const outputFile = 'project_source.txt';

concatenateSourceFiles(projectRoot, outputFile);