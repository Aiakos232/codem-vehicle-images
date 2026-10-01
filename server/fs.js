const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(GetResourcePath(GetCurrentResourceName()));
const IMAGES = path.join(ROOT, 'images');
const PICTURE = /^[\w.-]+\.(png|webp|jpg|jpeg)$/i;

function inside(rel) {
  if (typeof rel !== 'string' || rel === '') return null;
  const full = path.resolve(ROOT, rel);
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null;
  return full;
}

function ensureDir(rel) {
  const full = inside(rel || 'images');
  if (!full) return false;
  try {
    fs.mkdirSync(full, { recursive: true });
    return true;
  } catch (e) {
    console.log(`[codem-vehicle-images] ${rel}: ${e && e.message ? e.message : e}`);
    return false;
  }
}

function writePicture(file, b64) {
  try {
    if (typeof file !== 'string' || !PICTURE.test(file)) return false;
    if (typeof b64 !== 'string' || b64 === '') return false;
    const clean = b64.includes(',') ? b64.slice(b64.indexOf(',') + 1) : b64;
    const buf = Buffer.from(clean, 'base64');
    if (buf.length < 100 || buf.length > 4 * 1024 * 1024) return false;
    fs.mkdirSync(IMAGES, { recursive: true });
    fs.writeFileSync(path.join(IMAGES, file), buf);
    return true;
  } catch (e) {
    console.log(`[codem-vehicle-images] ${file}: ${e && e.message ? e.message : e}`);
    return false;
  }
}

ensureDir('images');

global.exports('ensureDir', ensureDir);
global.exports('writePicture', writePicture);
