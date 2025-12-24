const fs = require('fs');
const path = require('path');

const src = process.argv[2] || path.join(__dirname, '..', 'tmp', 'orig_script.js');
const outDir = path.join(__dirname, '..', 'data');
const text = fs.readFileSync(src, 'utf8');

const vars = ['echoesData','weaponsData','advancedSkillsData','armorData','conditionsData'];
const skip = new Set(['weapons.json','armor.json']);

function extractArray(text, name) {
  const idx = text.indexOf('const ' + name);
  if (idx === -1) return null;
  const start = text.indexOf('[', idx);
  if (start === -1) return null;
  let depth = 0;
  let end = -1;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '[') depth++;
    else if (text[i] === ']') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return null;
  return text.slice(start, end+1);
}

vars.forEach(v => {
  const base = v.replace(/Data$/, '');
  const jsonName = base + '.json';
  if (skip.has(jsonName) && fs.existsSync(path.join(outDir,jsonName))) {
    console.log('Skipping', jsonName);
    return;
  }
  const arrText = extractArray(text, v);
  if (!arrText) { console.warn('Not found', v); return; }

  // write temp cjs
  const tmpFile = path.join(__dirname, '..', 'tmp', base + '.cjs');
  fs.writeFileSync(tmpFile, 'module.exports = ' + arrText + ';', 'utf8');
  try {
    const obj = require(tmpFile);
    if (!obj) { console.warn('No obj for', v); }
    fs.writeFileSync(path.join(outDir, jsonName), JSON.stringify(obj, null, 2), 'utf8');
    console.log('Wrote', jsonName);
  } catch (err) {
    console.error('Error requiring', tmpFile, err && err.message);
  } finally {
    try{ fs.unlinkSync(tmpFile);}catch(e){}
  }
});
