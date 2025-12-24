const fs = require('fs');
const path = require('path');

const file = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(__dirname, '..', 'script.js');
const outDir = path.resolve(__dirname, '..', 'data');

const content = fs.readFileSync(file, 'utf8');

function extractVar(name) {
  const decl = `const ${name}`;
  const i = content.indexOf(decl);
  if (i === -1) return null;

  // find first '[' after declaration
  const start = content.indexOf('[', i);
  if (start === -1) return null;

  // scan for matching closing ']' (handle nested brackets)
  let depth = 0;
  let end = -1;
  for (let pos = start; pos < content.length; pos++) {
    const ch = content[pos];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        end = pos;
        break;
      }
    }
  }
  if (end === -1) return null;

  // include trailing ']' and possible semicolon
  let sliceEnd = end + 1;
  // advance past whitespace and semicolon
  while (sliceEnd < content.length && /[\s;\n\r]/.test(content[sliceEnd])) sliceEnd++;

  const arrText = content.slice(start, end + 1);
  return arrText;
}

const vars = [
  'echoesData',
  'weaponsData',
  'advancedSkillsData',
  'armorData',
  'conditionsData'
];

for (const v of vars) {
  const txt = extractVar(v);
  if (!txt) {
    console.warn('Could not find', v);
    continue;
  }

  // Wrap in parentheses and eval to get JS object -> JSON
  try {
    // Sanitization: normalize smart quotes/dashes and remove stray control characters
    let safe = txt
      .replace(/[\u2018\u2019\u201c\u201d]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u2012/g, '-')
      .replace(/\u00a0/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\r/g, '\n');

    // Remove trailing commas before closing array or object
    safe = safe.replace(/,\s*([\]\}])/g, '$1');

    // Instead of evaluating, write two artifacts:
    // 1) JSON file (best-effort) by attempting to JSON.stringify via eval fallback
    // 2) JS file that assigns the literal to a global var (safe to include as a script tag)
    const name = v.replace(/Data$/, '');
    const jsOutPath = path.join(outDir, name + '.js');
    const jsonOutPath = path.join(outDir, name + '.json');

    // write JS assignment using the literal slice (safe)
    const varName = `__be_${name}`;
    fs.writeFileSync(jsOutPath, `window.${varName} = ${safe}\n`);
    console.log('Wrote', jsOutPath);

    // Try to produce JSON by evaluating in a Function (best-effort)
    try {
      const obj = new Function('return ' + safe)();
      fs.writeFileSync(jsonOutPath, JSON.stringify(obj, null, 2));
      console.log('Wrote', jsonOutPath);
    } catch (err) {
      console.warn('Could not produce JSON for', name, '- JS fallback written');
    }
  } catch (err) {
    console.error('Error parsing', v, err.message);
  }
}
