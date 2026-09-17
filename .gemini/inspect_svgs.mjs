import fs from 'fs';

const svg1 = fs.readFileSync('public/logos/logo-gold-and-wihte.svg', 'utf8');
const svg2 = fs.readFileSync('public/logos/logo-with-grediant-brown-bg.svg', 'utf8');

console.log('=== logo-gold-and-wihte.svg ===');
console.log('Length:', svg1.length);
console.log('Has <image>:', svg1.includes('<image'));
console.log('Has <rect>:', svg1.includes('<rect'));
const vb1 = svg1.match(/viewBox="([^"]+)"/);
console.log('ViewBox:', vb1 ? vb1[1] : 'none');

console.log('\n=== logo-with-grediant-brown-bg.svg ===');
console.log('Length:', svg2.length);
console.log('Has <image>:', svg2.includes('<image'));
console.log('Has <rect>:', svg2.includes('<rect'));
const vb2 = svg2.match(/viewBox="([^"]+)"/);
console.log('ViewBox:', vb2 ? vb2[1] : 'none');
