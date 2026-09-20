const fs = require('fs');
const path = require('path');

const file = path.join('/home/may/projects/kukps-talai/kukps-talai-web', 'app/routes/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace colors
content = content.replace(/slate-/g, 'gray-');
content = content.replace(/emerald-50/g, 'gray-50');
content = content.replace(/emerald-100/g, 'gray-100');
content = content.replace(/emerald-200/g, 'gray-200');
content = content.replace(/emerald-300/g, 'gray-300');
content = content.replace(/emerald-400/g, 'gray-400');
content = content.replace(/emerald-500/g, 'gray-500');
content = content.replace(/emerald-600/g, 'black');
content = content.replace(/emerald-700/g, 'black');
content = content.replace(/emerald-800/g, 'black');
content = content.replace(/emerald-900/g, 'black');

// Specific text-emerald-100 / bg-emerald-x
content = content.replace(/text-black/g, 'text-black'); // normalize just in case
content = content.replace(/bg-black/g, 'bg-black text-white'); // ensure contrast
content = content.replace(/hover:bg-black/g, 'hover:bg-gray-900');
content = content.replace(/focus:ring-black/g, 'focus:ring-gray-900');
content = content.replace(/text-gray-100/g, 'text-white'); // was text-emerald-100

// Fix duplicate text-white if any
content = content.replace(/text-white text-white/g, 'text-white');
content = content.replace(/bg-black text-white text-white/g, 'bg-black text-white');
content = content.replace(/shadow-emerald-600\/20/g, 'shadow-black/20');
content = content.replace(/bg-emerald-600/g, 'bg-black');
content = content.replace(/text-emerald-700/g, 'text-black');
content = content.replace(/bg-emerald-50/g, 'bg-gray-50');
content = content.replace(/border-emerald-200\/80/g, 'border-gray-200');
content = content.replace(/border-emerald-200/g, 'border-gray-200');
content = content.replace(/bg-emerald-500/g, 'bg-gray-400');
content = content.replace(/hover:border-emerald-300/g, 'hover:border-gray-400');

fs.writeFileSync(file, content, 'utf8');

