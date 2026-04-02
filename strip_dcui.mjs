import fs from 'fs/promises';
import path from 'path';

async function getFiles(dir) {
    let results = [];
    try {
        const list = await fs.readdir(dir);
        for (let file of list) {
            file = path.join(dir, file);
            if (file.includes('node_modules') || file.includes('.git')) continue;
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

const dirRenames = {
    'dc-assets': 'dc-assets',
    'dc-lib': 'dc-lib'
};

async function renameDirectories() {
    for (const [oldName, newName] of Object.entries(dirRenames)) {
        try {
            const stat = await fs.stat(oldName);
            if (stat && stat.isDirectory()) {
                await fs.rename(oldName, newName);
                console.log(`Renamed directory ${oldName} -> ${newName}`);
            }
        } catch (e) {}
    }
}

async function renameFiles() {
    const files = await getFiles('.');
    for (let file of files) {
        const basename = path.basename(file);
        if (basename.includes('dcui') || basename.includes('Digital Craft')) {
            const newBasename = basename.replace(/dcui/g, 'dcui').replace(/Dcui/g, 'Dcui');
            const newPath = path.join(path.dirname(file), newBasename);
            await fs.rename(file, newPath);
            console.log(`Renamed file ${file} -> ${newPath}`);
        }
    }
}

async function processFiles() {
    const files = await getFiles('.');
    for (let file of files) {
        if (!file.endsWith('.html') && !file.endsWith('.js') && !file.endsWith('.mjs') && !file.endsWith('.css') && !file.endsWith('.json')) {
            continue;
        }
        if (file === 'strip_dcui.mjs' || file === 'fix_assets.mjs') continue;

        let content = await fs.readFile(file, 'utf8');
        let updated = false;

        const replacements = [
            { regex: /dcuiusercontent\.com/g, replacement: 'dc-assets' },
            { regex: /dcui\.com/g, replacement: 'dc-lib' },
            { regex: /dcui-/g, replacement: 'dcui-' },
            { regex: /__dcui/g, replacement: '__dcui' },
            { regex: /Digital Craft /g, replacement: 'Digital Craft ' },
            { regex: /"Digital Craft/g, replacement: '"Digital Craft' },
            { regex: /'Digital Craft/g, replacement: "'Digital Craft" },
            { regex: />Digital Craft</g, replacement: '>Digital Craft<' },
            { regex: /dcui/g, replacement: 'dcui' },
            { regex: /Dcui/g, replacement: 'Dcui' },
        ];

        let newContent = content;
        for (const { regex, replacement } of replacements) {
            if (regex.test(newContent)) {
                newContent = newContent.replace(regex, replacement);
                updated = true;
            }
        }

        if (updated) {
            await fs.writeFile(file, newContent, 'utf8');
            console.log(`Updated content in ${file}`);
        }
    }
}

async function main() {
    console.log('Renaming Directories...');
    await renameDirectories();
    console.log('Renaming Files...');
    await renameFiles(); // Rename files first so that when we process files we open the right paths
    console.log('Processing File Content...');
    await processFiles();
    console.log('Done!');
}

main();
