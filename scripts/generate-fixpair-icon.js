const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Helper to generate a 256x256 PNG file with pure Node.js (using zlib)
function createPng(width, height, getPixel) {
  // Raw RGBA image data buffer (with 1 filter byte per scanline)
  const rowSize = 1 + width * 4;
  const rawBuffer = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    rawBuffer[rowStart] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxStart = rowStart + 1 + x * 4;
      rawBuffer[pxStart] = r;
      rawBuffer[pxStart + 1] = g;
      rawBuffer[pxStart + 2] = b;
      rawBuffer[pxStart + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawBuffer);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4);
  data.copy(buffer, 8);

  const crc = calculateCrc(buffer.slice(4, 8 + length));
  buffer.writeUInt32BE(crc, 8 + length);
  return buffer;
}

// CRC32 table & calculation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function calculateCrc(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Draw a modern, sleek Fixpair icon (256x256)
const width = 256;
const height = 256;

const pngBuffer = createPng(width, height, (x, y, w, h) => {
  // Normalized coords
  const nx = x / w;
  const ny = y / h;

  // Background: Rounded rect with smooth subtle shadow & vibrant emerald/teal/indigo gradient
  const cx = 0.5;
  const cy = 0.5;
  const rx = Math.abs(nx - cx);
  const ry = Math.abs(ny - cy);

  // Soft rounded container boundary
  const cornerDist = Math.hypot(Math.max(0, rx - 0.38), Math.max(0, ry - 0.38));
  if (cornerDist > 0.08) {
    return [0, 0, 0, 0]; // Transparent outside
  }

  // Smooth background gradient (Fixpair Theme: Deep Indigo / Emerald / Cyan)
  const grad = nx * 0.4 + ny * 0.6;
  let bgR = Math.floor(16 + grad * 10);
  let bgG = Math.floor(185 - grad * 35);
  let bgG2 = Math.floor(129 + grad * 20);
  let bgB = Math.floor(120 + grad * 60);

  // Fixpair "F" geometric brand badge in center
  // Center is (128, 128), let's render the Fixpair icon:
  // Stem: x in [72, 104], y in [64, 192]
  // Top bar: x in [72, 184], y in [64, 96]
  // Mid bar: x in [72, 156], y in [116, 144]
  const inStem = (x >= 72 && x <= 104 && y >= 64 && y <= 192);
  const inTopBar = (x >= 72 && x <= 184 && y >= 64 && y <= 98);
  const inMidBar = (x >= 72 && x <= 156 && y >= 118 && y <= 148);

  // Rounded caps for logo lines
  const dTopRight = Math.hypot(x - 180, y - 81);
  const dMidRight = Math.hypot(x - 152, y - 133);
  const dBottom = Math.hypot(x - 88, y - 188);

  const inLogo = inStem || inTopBar || inMidBar;

  if (inLogo) {
    // Pure crisp white with subtle specular gloss
    const gloss = (1 - ny) * 35;
    return [
      Math.min(255, 255),
      Math.min(255, 255),
      Math.min(255, 255),
      255
    ];
  }

  // Diamond accent in corner of Fixpair icon
  // Diamond centered at (176, 176)
  const dx = Math.abs(x - 172);
  const dy = Math.abs(y - 172);
  if (dx + dy <= 16) {
    return [255, 255, 255, 240];
  }

  // Return background gradient
  return [16, 185, 129, 255];
});

const pubDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(pubDir, 'fixpair-icon.png'), pngBuffer);
fs.writeFileSync(path.join(pubDir, 'favicon.png'), pngBuffer);

console.log('Fixpair Brand Icon generated successfully in public/fixpair-icon.png and public/favicon.png!');
