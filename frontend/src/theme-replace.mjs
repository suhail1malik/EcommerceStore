import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let count = 0;
walkDir('/Users/apple/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Projects Main/E-Commerce-Store/frontend/src', function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/amber-/g, 'indigo-').replace(/orange-/g, 'violet-');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated ' + filePath);
            count++;
        }
    }
});
console.log(`Successfully updated ${count} files to the new Royal Indigo theme.`);
