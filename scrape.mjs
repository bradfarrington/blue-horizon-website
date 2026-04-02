import fs from 'fs/promises';
import path from 'path';
import { URL } from 'url';

const downloaded = new Set();
const toDownload = new Set();

const domainsToScrape = [
    'dc-assets',
    'dc-lib',
    'fonts.gstatic.com',
    'fonts.googleapis.com'
];

async function downloadFile(url) {
    if (downloaded.has(url)) return;
    downloaded.add(url);
    console.log(`Downloading ${url}`);
    
    try {
        const localPathAbsolute = getLocalPathFromUrl(url);
        if (!localPathAbsolute) return;
        const localPath = localPathAbsolute.substring(1); // remove leading slash
        
        const fullLocalPath = path.join(process.cwd(), localPath);
        await fs.mkdir(path.dirname(fullLocalPath), { recursive: true });
        
        const content = await fetchWithRetry(url);
        
        let modifiedContent = content;
        if (localPath.endsWith('.mjs') || localPath.endsWith('.js') || localPath.endsWith('.css') || localPath.endsWith('.html')) {
            modifiedContent = await processContent(content.toString('utf8'), url);
        }
        
        if (modifiedContent instanceof Buffer) {
            await fs.writeFile(fullLocalPath, modifiedContent);
        } else {
            await fs.writeFile(fullLocalPath, modifiedContent, 'utf8');
        }
    } catch (e) {
        console.error(`Failed to download ${url}: ${e.message}`);
    }
}

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const arrayBuffer = await res.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

function getLocalPathFromUrl(urlStr) {
    try {
        if (urlStr.includes('&amp;')) urlStr = urlStr.replace(/&amp;/g, '&');
        const u = new URL(urlStr);
        if (!domainsToScrape.includes(u.hostname)) return null;
        let p = u.hostname + u.pathname;
        if (u.search) {
            // Put the search parameters before the original file extension so that the final file ends in the proper extension
            const extMatch = p.match(/\.[a-zA-Z0-9]{2,5}$/);
            const ext = extMatch ? extMatch[0] : '';
            const pWithoutExt = ext ? p.slice(0, -ext.length) : p;
            
            p = pWithoutExt + '_' + u.search.replace(/[^a-zA-Z0-9]/g, '_') + ext;
            if (u.hostname === 'fonts.googleapis.com' && !ext) p += '.css';
        }
        return '/' + p; // Returns absolute path so it works from anywhere
    } catch(e) {
        return null;
    }
}

const urlRegex = /https:\/\/(?:dcuiusercontent\.com|dcui\.com|fonts\.gstatic\.com|fonts\.googleapis\.com)[^\s"'<>\)\[\]{}`,\\]+/g;

async function processContent(contentStr, sourceUrl) {
    // 1. Process absolute URLs
    const urls = contentStr.match(urlRegex) || [];
    for (let url of urls) {
        if (url.includes('&amp;')) url = url.replace(/&amp;/g, '&');
        if (!downloaded.has(url)) toDownload.add(url);
    }
    contentStr = contentStr.replace(urlRegex, (match) => {
        let local = getLocalPathFromUrl(match);
        if (local) {
            return local; // absolute path starting with /
        }
        return match;
    });

    // 2. Process relative string imports in JS/CSS
    if (sourceUrl && sourceUrl.startsWith('http')) {
        const baseUrl = new URL(sourceUrl);
        
        // Find things like `"./chunk-123.mjs"` or `'../assets/foo.png'`
        const relStringRegex = /(?<=['"])(?:\.\/|\.\.\/)[^'"]+(?=['"])/g;
        contentStr = contentStr.replace(relStringRegex, (match) => {
            try {
                const resolvedUrl = new URL(match, baseUrl).href;
                
                // Ensure it's not going outside the domains we care about
                if (domainsToScrape.some(d => resolvedUrl.includes(d))) {
                    if (!downloaded.has(resolvedUrl)) {
                        toDownload.add(resolvedUrl);
                    }
                    let local = getLocalPathFromUrl(resolvedUrl);
                    if (local) {
                        return local; // absolute path starting with /
                    }
                }
            } catch(e) {}
            return match;
        });
    }
    
    return contentStr;
}

async function processHtmlFiles() {
    const files = await fs.readdir(process.cwd());
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    
    for (const file of htmlFiles) {
        console.log(`Analyzing HTML file: ${file}`);
        const content = await fs.readFile(file, 'utf8');
        const urls = content.match(urlRegex) || [];
        for (const url of urls) {
            toDownload.add(url);
        }
    }
}

async function downloadAll() {
    while (toDownload.size > 0) {
        const urls = Array.from(toDownload);
        console.log(`Found ${urls.length} resources to download in this pass...`);
        toDownload.clear();
        
        for (let i = 0; i < urls.length; i += 20) {
            const batch = urls.slice(i, i + 20);
            await Promise.all(batch.map(u => downloadFile(u)));
        }
    }
}

async function rewriteHtmlFiles() {
    const files = await fs.readdir(process.cwd());
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    
    for (const file of htmlFiles) {
        console.log(`Rewriting ${file}`);
        let content = await fs.readFile(file, 'utf8');
        content = await processContent(content, file);
        
        // Remove tracking code & Digital Craft specifics
        content = content.replace(/<script>try\s*\{\s*if\s*\(localStorage\.get\("__dcui_force_showing_editorbar_since"\)\)[\s\S]*?<\/script>/g, '');
        content = content.replace(/<script async src="https:\/\/events\.dcui\.com[^>]*><\/script>/g, '');
        content = content.replace(/<div id="__dcui-editorbar-container"[\s\S]*?<\/div>/g, '');
        content = content.replace(/<iframe id="__dcui-editorbar"[\s\S]*?<\/iframe>/g, '');
        
        await fs.writeFile(file, content, 'utf8');
    }
}

async function main() {
    console.log("Starting scrape...");
    await processHtmlFiles();
    await downloadAll();
    await rewriteHtmlFiles();
    console.log("Done!");
}

main().catch(console.error);
