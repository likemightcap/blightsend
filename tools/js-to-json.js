const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dataDir = path.resolve(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));

// Skip files with existing JSON that are user-edited
const skipIfJsonExists = new Set(['weapons.json','armor.json']);

for (const f of files) {
  const base = path.basename(f, '.js');
  const jsonName = base + '.json';
  if (skipIfJsonExists.has(jsonName) && fs.existsSync(path.join(dataDir,jsonName))) {
    console.log('Skipping', jsonName, '- user JSON exists');
    continue;
  }

  const full = path.join(dataDir, f);
  const src = fs.readFileSync(full, 'utf8');

  // We'll run it in a small VM where `window` is an object we control.
  const sandbox = { window: {} };
  try {
    vm.createContext(sandbox);
    vm.runInContext(src, sandbox, { filename: full });
    // find the property on window
    const prop = Object.keys(sandbox.window).find(k => k.startsWith('__be_'));
    if (!prop) {
      console.warn('No __be_ property found in', f);
      continue;
    }
    const value = sandbox.window[prop];
    if (!Array.isArray(value)) {
      console.warn('Value is not an array for', f);
      continue;
    }
    const out = JSON.stringify(value, null, 2);
    fs.writeFileSync(path.join(dataDir, jsonName), out, 'utf8');
    console.log('Wrote', jsonName);
  } catch (err) {
    console.error('Failed parsing', f, err && err.message);
  }
}
