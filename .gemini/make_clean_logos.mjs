import fs from 'fs';
import sharp from 'sharp';

const svg = fs.readFileSync('public/logos/logo-gold-and-wihte.svg', 'utf8');

// 1. Full logo with dark text (for light backgrounds)
const darkTextLogo = svg
  .replace('.cls-2{fill:#ede8e4;}', '.cls-2{fill:#36302f;}')
  .replace('.cls-32{fill:#f8f4ec;}', '.cls-32{fill:#8e6e4f;}');

fs.writeFileSync('public/logos/logo-gold-dark-text.svg', darkTextLogo);

// 2. Pure emblem only (no text, viewBox cropped to tooth)
const emblemOnly = svg
  .replace(/<path class="cls-2"[^>]+>/g, '')
  .replace(/<path class="cls-32"[^>]+>/g, '')
  .replace('viewBox="0 0 80.97 104.87"', 'viewBox="0 0 80.97 83"');

fs.writeFileSync('public/logos/logo-emblem-gold.svg', emblemOnly);

console.log('Successfully created logo-gold-dark-text.svg and logo-emblem-gold.svg');
