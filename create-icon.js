const fs = require('fs');
const path = require('path');

// Create a simple SVG icon for SAM.CHAT
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" fill="url(#grad1)" rx="50"/>
  <circle cx="128" cy="128" r="100" fill="white" opacity="0.1"/>
  <text x="128" y="145" font-size="80" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial, sans-serif">S</text>
  <circle cx="180" cy="80" r="20" fill="#10B981" opacity="0.9"/>
</svg>`;

const iconPath = path.join(__dirname, 'public', 'icon.svg');
fs.writeFileSync(iconPath, svgIcon);
console.log('Icon created at:', iconPath);
