import fs from 'fs';

const svg = fs.readFileSync('public/logos/logo-gold-and-wihte.svg', 'utf8');

// Find all paths and their classes
const paths = svg.match(/<path[^>]+>/g) || [];
console.log('Total paths:', paths.length);

const classCounts = {};
for (const p of paths) {
  const m = p.match(/class="([^"]+)"/);
  const cls = m ? m[1] : 'none';
  classCounts[cls] = (classCounts[cls] || 0) + 1;
}

console.log('Class counts:', classCounts);
