#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = './';

async function listDir(dirPath, prefix = '', isLast = true) {
  let output = '';

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const lastIndex = entries.length - 1;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const entryPath = path.join(dirPath, entry.name);
      const isEntryLast = i === lastIndex;

      // Ignore node_modules and dist
      if(entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      
      const branchPrefix = prefix + (isLast ? '   ' : '│  ');
        
      const entryPrefix = (i == lastIndex) ? '└──' : '├──';

      output += `${branchPrefix}${entryPrefix} ${entry.name}\n`;
      if (entry.isDirectory()) {
        output += await listDir(entryPath, prefix + (isLast ? '   ' : '│  '), isEntryLast);
      }
    }
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error);
    return '';
  }

  return output;
}

async function main() {
  const output = await listDir(rootDir);
  console.log(output);
}

main();