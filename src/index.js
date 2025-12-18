import { loadAllData } from './data-loader';

// This file is an entrypoint for builds. It doesn't currently replace the existing
// `script.js` in the live site, but it allows you to build a modern module bundle.

export async function buildLoad() {
  const d = await loadAllData();
  // re-export to window for compatibility (optional)
  window.__be_built = d;
  return d;
}

// Auto-run when included (convenience for development builds)
if (typeof window !== 'undefined') {
  buildLoad().catch(e => console.warn('buildLoad failed', e));
}
