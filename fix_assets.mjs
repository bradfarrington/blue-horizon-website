import fs from 'fs/promises';
import path from 'path';

// Directories to scan
const dirsToScan = [
    'framerusercontent.com',
    'framer.com',
    'fonts.gstatic.com',
    'fonts.googleapis.com'
];

async function getFiles(dir) {
    let results = [];
    try {
        const list = await fs.readdir(dir);
        for (let file of list) {
            file = path.join(dir, file);
            const stat = await fs.stat(file);
            if (stat && stat.isDirectory()) {
                results = results.concat(await getFiles(file));
            } else {
                results.push(file);
            }
        }
    } catch(e) {}
    return results;
}

async function fixFileExtensions() {
    let renameMap = new Map(); // oldName -> newName
    for (const d of dirsToScan) {
        const files = await getFiles(d);
        for (const file of files) {
            const basename = path.basename(file);
            // Example: VmJluSYMHlPycaUaW84WpCYle8.svg__width_60_height_60
            // We want to extract .svg and move it to the end
            const match = basename.match(/(\.[a-zA-Z0-9]+)(__.+)$/);
            if (match) {
                const ext = match[1];
                const searchStr = match[2];
                if (!searchStr.endsWith(ext)) {
                    const newBasename = basename.replace(match[0], searchStr + ext);
                    const newPath = path.join(path.dirname(file), newBasename);
                    await fs.rename(file, newPath);
                    renameMap.set(file, newPath);
                    console.log(`Renamed: ${file} -> ${newPath}`);
                }
            }
        }
    }
    return renameMap;
}

async function fixReferences(renameMap) {
    const htmlFiles = (await fs.readdir('.')).filter(f => f.endsWith('.html'));
    
    let allFilesToUpdate = [...htmlFiles];
    for (const d of dirsToScan) {
        const files = await getFiles(d);
        for (const f of files) {
            if (f.endsWith('.mjs') || f.endsWith('.js') || f.endsWith('.css') || f.endsWith('.json')) {
                allFilesToUpdate.push(f);
            }
        }
    }
    
    for (const file of allFilesToUpdate) {
        try {
            let content = await fs.readFile(file, 'utf8');
            let updated = false;

            // 1. Replace all renamed paths
            for (const [oldPath, newPath] of renameMap.entries()) {
                // Ensure the path starts with / because URLs in the files are absolute
                const oldUrlMatch = '/' + oldPath.replace(/\\/g, '/');
                const newUrlMatch = '/' + newPath.replace(/\\/g, '/');
                if (content.includes(oldUrlMatch)) {
                    content = content.split(oldUrlMatch).join(newUrlMatch);
                    updated = true;
                }
            }

            // 2. Turn absolute absolute local paths into relative local paths in HTML files ONLY
            // because `src="/framerusercontent.com/..."` fails when simply opened via file:// or served incorrectly
            if (file.endsWith('.html')) {
                const absoluteMatches = ['/framerusercontent.com/', '/framer.com/', '/fonts.gstatic.com/', '/fonts.googleapis.com/'];
                for (const match of absoluteMatches) {
                    if (content.includes(`"${match}`)) {
                        content = content.replace(new RegExp(`"${match}`, 'g'), `"./${match.substring(1)}`);
                        updated = true;
                    }
                }
            }

            if (updated) {
                await fs.writeFile(file, content, 'utf8');
                console.log(`Updated references in ${file}`);
            }
        } catch(e) {
            console.error(`Error processing ${file}`, e);
        }
    }
}

async function main() {
    console.log("Fixing extensions...");
    const renameMap = await fixFileExtensions();
    console.log("Fixing references...");
    await fixReferences(renameMap);
    console.log("Done.");
}

main();
