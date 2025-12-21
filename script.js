/* ---------------------------------------------------
   BLIGHTSEND APP ROUTER + COMPENDIUM + CHARACTER SHEET
   (Single-file script.js replacement)
----------------------------------------------------*/

/* ===================================================
   1) DATA (loaded at runtime from data/*.json)
=================================================== */

// Data arrays will be populated at runtime from the `data/` folder to make content edits
// simpler and keep this file focused on UI logic.
let echoesData = [];
let weaponsData = [];
let advancedSkillsData = [];
let armorData = [];
let conditionsData = [];

// Current weapon selections on the sheet (persisted with character)
const weaponsState = {
  // keys are data-slot values (eg. melee1, melee2, ranged1)
};

let _dataLoaded = false;
let _dataLoadPromise = null;

function ensureDataLoaded() {
  if (_dataLoaded) return Promise.resolve();
  if (_dataLoadPromise) return _dataLoadPromise;

  _dataLoadPromise = (async () => {
    try {
      // If a built bundle provided data (dist/bundle.js -> window.__be_built), prefer it to avoid duplicate fetches
      if (typeof window !== 'undefined' && window.__be_built) {
        const built = window.__be_built;
        echoesData = built.echoes || [];
        weaponsData = built.weapons || [];
        advancedSkillsData = built.skills || [];
        armorData = built.armor || [];
        conditionsData = built.conditions || [];
        _dataLoaded = true;
        return;
      }
      // Dynamically compute the site root for GH Pages compatibility
      function getSiteRoot() {
        const path = window.location.pathname;
        const match = path.match(/^\/(.+?)\//);
        return match ? `/${match[1]}/` : '/';
      }
      const siteRoot = getSiteRoot();
      const [echoesR, weaponsR, skillsR, armorR, conditionsR] = await Promise.all([
        fetch(siteRoot + 'data/echoes.json'),
        fetch(siteRoot + 'data/weapons.json'),
        fetch(siteRoot + 'data/skills.json'),
        fetch(siteRoot + 'data/armor.json'),
        fetch(siteRoot + 'data/conditions.json')
      ]);

      // parse responses if ok, otherwise default to empty array
      let _showedDataError = false;
      const safeJson = async (res, name) => {
        if (!res) {
          console.error('Missing response for', name);
          if (!_showedDataError) { _showedDataError = true; showDataError(`${name}: no response`); }
          return [];
        }
        if (!res.ok) {
          console.error(`Failed to load ${name}: ${res.status} ${res.statusText}`);
          if (!_showedDataError) { _showedDataError = true; showDataError(`${name}: ${res.status} ${res.statusText}`); }
          return [];
        }
        try {
          return await res.json();
        } catch (e) {
          console.error('JSON parse error for', name, e);
          if (!_showedDataError) { _showedDataError = true; showDataError(`${name}: invalid JSON`); }
          return [];
        }
      };

      echoesData = await safeJson(echoesR, 'echoes');
      weaponsData = await safeJson(weaponsR, 'weapons');
      // NOTE: skills.json maps to advancedSkillsData in memory
      advancedSkillsData = await safeJson(skillsR, 'skills');
      armorData = await safeJson(armorR, 'armor');
      conditionsData = await safeJson(conditionsR, 'conditions');

      _dataLoaded = true;
    } catch (err) {
      console.error('Error loading data files', err);
    }
  })();

  return _dataLoadPromise;
}

// --- Floating numeric HUD (single instance) ---
function createNumHudOnce(){
  if (document.getElementById('_beNumHud')) return;
  const hud = document.createElement('div');
  hud.id = '_beNumHud';
  hud.className = 'be-hidden';
  hud.innerHTML = `<div class="be-num-hud-inner"><button class="be-num-hud-btn" data-action="minus">−</button><button class="be-num-hud-btn" data-action="plus">+</button></div>`;
  // position absolute at body level
  hud.style.position = 'absolute';
  hud.style.display = 'none';
  document.body.appendChild(hud);

  // wire hud buttons
  hud.addEventListener('click', (e) => {
    const btn = e.target.closest('.be-num-hud-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const targetId = hud.dataset.targetId;
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;
    e.preventDefault();
    const cur = Number(input.value || '0');
    if (action === 'plus') input.value = String(cur + 1);
    if (action === 'minus') input.value = String(Math.max(0, cur - 1));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // refresh hide timer
    scheduleHudHide();
  });

  // hide HUD when clicking outside
  document.addEventListener('click', (ev) => {
    const hudEl = document.getElementById('_beNumHud');
    if (!hudEl) return;
    if (hudEl.contains(ev.target)) return;
    // allow clicks on number inputs to be handled separately
    if (ev.target && ev.target.classList && ev.target.classList.contains('be-num')) return;
    hideNumHud();
  }, { capture: true });
}

let _beNumHudTimer = null;
function scheduleHudHide(delay = 1400){
  if (_beNumHudTimer) clearTimeout(_beNumHudTimer);
  _beNumHudTimer = setTimeout(() => hideNumHud(), delay);
}

function showNumHudForInput(input){
  createNumHudOnce();
  const hud = document.getElementById('_beNumHud');
  if (!hud || !input) return;
  // attach target id so HUD actions know which input to modify
  if (!input.id) input.id = 'be_num_' + Math.random().toString(36).slice(2,9);
  hud.dataset.targetId = input.id;
  // position HUD near the input (above if space)
  const rect = input.getBoundingClientRect();
  const hudW = 120; const hudH = 56;
  let top = window.scrollY + rect.top - hudH - 8;
  let left = window.scrollX + rect.left + (rect.width/2) - (hudW/2);
  // keep within viewport
  left = Math.max(8, Math.min(left, window.scrollX + document.documentElement.clientWidth - hudW - 8));
  if (top < window.scrollY + 8) top = window.scrollY + rect.bottom + 8; // put below if not enough space above
  hud.style.left = left + 'px';
  hud.style.top = top + 'px';
  hud.style.width = hudW + 'px';
  hud.style.height = hudH + 'px';
  hud.style.display = 'block';
  hud.classList.remove('be-hidden');
  scheduleHudHide();
}

function hideNumHud(){
  const hud = document.getElementById('_beNumHud');
  if (!hud) return;
  hud.style.display = 'none';
  hud.classList.add('be-hidden');
  if (_beNumHudTimer) { clearTimeout(_beNumHudTimer); _beNumHudTimer = null; }
  delete hud.dataset.targetId;
}

// Attach tap/focus handlers to numeric inputs to show floating HUD
function bindFloatingNumHud(){
  createNumHudOnce();
  $all('input.be-num').forEach(inp => {
    if (inp.dataset.hudBound) return;
    inp.dataset.hudBound = '1';
    // show on touchstart / click / focus
    inp.addEventListener('touchstart', (e)=> { e.stopPropagation(); showNumHudForInput(inp); });
    inp.addEventListener('click', (e)=> { e.stopPropagation(); showNumHudForInput(inp); });
    inp.addEventListener('focus', ()=> { showNumHudForInput(inp); });
    // when the input value changes via other means, keep HUD visible briefly
    inp.addEventListener('input', () => scheduleHudHide());
  });
}

// Ensure HUDs are bound when steppers are bound / after sheet is rendered
// call this at the end of bindAllSteppers or whenever inputs are created
;(() => {
  // small hook: run after current tick so initial elements exist
  setTimeout(() => bindFloatingNumHud(), 60);
  // also re-bind on any future DOM additions that use .num-wrap via a MutationObserver
  const mo = new MutationObserver((mut) => {
    bindFloatingNumHud();
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

/* ===================================================
   2) SMALL UTILITIES
=================================================== */

function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}
function normalize(str) {
  return (str || "").toString().toLowerCase();
}

function injectSheetStylesOnce() {
  if ($("#_beSheetStyles")) return;
  const style = document.createElement("style");
  style.id = "_beSheetStyles";
  style.textContent = `
    /* Character Sheet injected styles (kept minimal + matches your dark vibe) */
    #homeScreen, #sheetScreen { width: 100%; max-width: 900px; margin: 0 auto; }
    .be-hidden { display: none !important; }

    /* Make the app feel native: prevent text selection and image dragging globally,
       but allow inputs and textareas to remain editable/selectable */
    html, body, #app { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
    img { -webkit-user-drag: none; user-drag: none; -webkit-user-select: none; user-select: none; }
    input, textarea, select { -webkit-user-select: text; user-select: text; }

    .home-wrap{
      min-height: calc(100vh - 2rem);
      display:flex; flex-direction:column; gap:1.25rem;
      align-items:center; justify-content:flex-start;
      padding: 1.25rem 0.5rem;
    }
    .home-logo{
      width:min(520px, 92vw);
      height:auto;
      margin-top: 0.25rem;
      user-select:none;
      pointer-events:none;
      filter: none;
    }
    .home-btn{
      width:min(560px, 92vw);
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.10);
      color: var(--text-main);
      padding: 2.25rem 1rem;
      font-size: 1.25rem;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      cursor:pointer;
      box-shadow: 0 18px 40px rgba(0,0,0,0.55);
    }
    .home-btn:active{ transform: scale(0.985); }

    .sheet-header{
      display:flex; align-items:center; justify-content:space-between;
      gap:0.75rem;
      padding: 0.75rem 0.25rem 0.25rem;
    }
    .sheet-menu-btn{
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(14, 15, 21, 0.85);
      color: var(--text-main);
      padding: 0.6rem 0.9rem;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      cursor:pointer;
      display:flex;
      align-items:center;
      gap:0.5rem;
      white-space:nowrap;
    }
    .sheet-title-logo{
      height: 44px; width:auto; object-fit:contain;
      user-select:none; pointer-events:none;
      filter: none;
    }
    .sheet-title-btn{
      background: transparent;
      border: 0;
      padding: 0;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
    .sheet-title-btn img{ pointer-events: none; }

    .sheet-card{
      margin-top: 0.5rem;
      background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.55));
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-soft);
      box-shadow: var(--shadow-soft);
      padding: 1rem;
    }

    .sheet-grid-top{
      display:grid;
      grid-template-columns: 1fr 110px;
      gap: 0.75rem;
      align-items:end;
      margin-bottom: 0.9rem;
    }
    .sheet-row{
      display:grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-bottom: 0.9rem;
    }

    .stat-strip{
      border-radius: var(--radius-md);
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(80, 140, 160, 0.25);
      padding: 0.75rem;
      display:grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .sheet-buttons{
      display:grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .field-label{
      font-size: 0.85rem;
      color: var(--text-main);
      opacity: 0.92;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.35rem;
      white-space:nowrap;
    }

    input[type="text"].be-text{
      width:100%;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(7, 9, 13, 0.9);
      color: var(--text-main);
      padding: 0.75rem 0.8rem;
      font-size: 1rem;
    }

    .num-wrap{
      display:flex;
      align-items:stretch;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(7, 9, 13, 0.9);
      overflow:hidden;
      height: 44px;
    }
    input[type="number"].be-num{
      width: 100%;
      min-width: 0;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--text-main);
      padding: 0 0.75rem;
      font-size: 1rem;
      appearance: textfield;
      -moz-appearance: textfield;
    }
    input[type="number"].be-num::-webkit-outer-spin-button,
    input[type="number"].be-num::-webkit-inner-spin-button{
      -webkit-appearance: none;
      margin: 0;
    }
    .stepper{
      display:flex;
      flex-direction:column;
      border-left: 1px solid rgba(255,255,255,0.10);
      width: 44px;
      flex: 0 0 44px;
    }
    /* Hide permanent steppers — replaced with a floating HUD */
    .stepper{ display: none !important; }
    .stepper button{
      flex: 1;
      border: 0;
      background: rgba(255,255,255,0.06);
      color: var(--text-main);
      cursor:pointer;
      font-size: 0.95rem;
      line-height: 1;
    }

    /* Floating numeric HUD (appears on tap/focus) */
    #_beNumHud{ position: absolute; display: none; z-index: 1200; pointer-events: auto; }
    #_beNumHud .be-num-hud-inner{ display:flex; gap:6px; align-items:center; justify-content:center; background: rgba(10,10,12,0.95); border-radius: 10px; padding:6px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.06); }
    #_beNumHud .be-num-hud-btn{ display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius: 8px; border: none; background: rgba(255,255,255,0.04); color: var(--text-main); font-size: 1.1rem; font-weight:700; cursor:pointer; }
    @media (max-width:420px){
      #_beNumHud .be-num-hud-btn{ width:36px; height:36px; font-size:1rem; }
    }
    .stepper button:active{ background: rgba(192,255,122,0.14); }

    .sheet-action{
      border-radius: var(--radius-md);
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.10);
      color: var(--text-main);
      padding: 1.2rem 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      cursor:pointer;
      font-size: 1rem;
    }
    .sheet-action:active{ transform: scale(0.99); }

    /* Menu overlay */
    #sheetMenuOverlay{
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at top, rgba(0,0,0,0.86), rgba(0,0,0,0.96));
      display:none;
      align-items:center;
      justify-content:center;
      z-index: 100;
      padding: 1rem;
    }
    #sheetMenuOverlay.show{ display:flex; }
    .sheet-menu-modal{
      width: 100%;
      max-width: 520px;
      border-radius: var(--radius-lg);
      border: 1px solid rgba(192,255,122,0.35);
      background:
        radial-gradient(circle at top, rgba(192,255,122,0.08), transparent 60%),
        rgba(10, 10, 12, 0.95);
      box-shadow: 0 22px 60px rgba(0,0,0,0.95);
      padding: 1rem;
    }
    .sheet-menu-title{
      font-size: 1.0rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      margin-bottom: 0.75rem;
    }
    .sheet-menu-list{ display:flex; flex-direction:column; gap:0.5rem; }
    .sheet-menu-item{
      width:100%;
      text-align:left;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.06);
      color: var(--text-main);
      padding: 0.9rem 0.9rem;
      cursor:pointer;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.85rem;
    }
    .sheet-menu-item:active{ background: rgba(192,255,122,0.14); }

    /* Tiny: keep name + HP side-by-side and make stat rows inline on narrow screens per mobile design */
    @media (max-width: 420px){
      /* keep name and HP next to each other */
      .sheet-grid-top{ grid-template-columns: 1fr 110px; }
      /* show stamina/ephem/walk/run each in their own column (inputs under labels)
         if the screen is too narrow, they will shrink but remain inline per reference */
      .sheet-row{ grid-template-columns: repeat(4, 1fr); }
      /* show all small stats inline as a single row */
      .stat-strip{ grid-template-columns: repeat(5, 1fr); font-size:0.9rem; }
  /* keep three buttons in a single row; shrink their padding so they fit */
  .sheet-buttons{ grid-template-columns: repeat(3, 1fr); }
  .sheet-action{ padding: 0.7rem 0.5rem; font-size: 0.9rem; }
      /* make steppers more compact on mobile */
      .stepper{ width: 30px; flex: 0 0 30px; }
      .stepper button{ font-size: 0.75rem; }
      /* slightly reduce input paddings to fit */
      input[type="number"].be-num{ padding: 0 0.5rem; font-size: 0.95rem; }
    }

    /* Toast */
    #beToast{
      position: fixed;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.75);
      border: 1px solid rgba(255,255,255,0.12);
      color: #fff;
      padding: 10px 12px;
      border-radius: 999px;
      font-size: 0.85rem;
      letter-spacing: 0.04em;
      z-index: 200;
      display:none;
      max-width: min(92vw, 520px);
      text-align:center;
    }
    #beToast.show{ display:block; }
  `;
  document.head.appendChild(style);
}

// Prevent image context menu and dragging to make the app feel more like a native app
function installAppLikeBehaviors(){
  // block right-click context menu on images
  document.addEventListener('contextmenu', (e) => {
    try {
      if (e.target && e.target.closest && e.target.closest('img')) {
        e.preventDefault();
      }
    } catch (err) { /* ignore */ }
  }, { capture: true });

  // block dragstart on images
  document.addEventListener('dragstart', (e) => {
    try {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    } catch (err) {}
  }, { capture: true });

  // Haptic feedback for button presses (where supported)
  // Use navigator.vibrate when available. We listen for pointerdown on interactive
  // elements so vibration feels immediate (like native tap). We guard to avoid
  // calling vibrate too often by ignoring non-button targets.
  const supportsVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  if (supportsVibrate) {
    let lastV = 0;
    document.addEventListener('pointerdown', (ev) => {
      try {
        const t = ev.target;
        // consider a target interactive if it's a <button>, has role=button,
        // is an input[type=button], or is an element with [data-action] attribute
        const interactive = t.closest && t.closest('button, [role="button"], input[type="button"], [data-action], .sheet-action, .sheet-menu-item, .sheet-menu-btn, .sheet-title-btn, .armor-slot, .be-num-hud-btn');
        if (!interactive) return;
        const now = Date.now();
        // throttle to ~60ms to avoid multi-vibrate on the same press
        if (now - lastV < 60) return;
        lastV = now;
        // short, subtle vibration (10ms)
        navigator.vibrate(10);
      } catch (err) { /* ignore vibration errors */ }
    }, { capture: true });
  }
}

// Additional armor panel styles appended to the same injected style block
function injectArmorStylesOnce(){
  if ($('#_beArmorStyles')) return;
  const s = document.createElement('style');
  s.id = '_beArmorStyles';
  s.textContent = `
  .sheet-armor-panel{ max-width:900px; margin: 1rem auto; padding: 1rem 1.25rem; background: var(--bg-panel); border-radius: 12px; }
    /* Make the avatar column larger so the avatar is more prominent */
    .armor-grid{ display:flex; gap: 0.85rem; align-items:center; }
  /* left: large avatar area; right: stacked pills column */
  .armor-avatar-col{ flex: 0 0 58%; display:flex; align-items:center; justify-content:center; }
  .armor-list-col{ flex: 0 0 38%; max-width: 38%; min-width:220px; display:flex; flex-direction:column; gap:0.9rem; }
  .armor-avatar-img{ max-width: 100%; height:auto; display:block; filter: none; box-shadow: none; }
    .armor-row{ display:flex; flex-direction:column; gap:6px; align-items:stretch; }
    /* Pill should span almost full column; stats are shown below */
  /* Make armor slots visually match weapon selectors (cohesive controls) */
  .armor-slot{ background: rgba(0,0,0,0.28); color: var(--text-main); border:1px solid rgba(255,255,255,0.06); padding:10px 14px; border-radius:14px; font-weight:800; letter-spacing:0.08em; cursor:pointer; width:100%; text-align:center; font-size:0.98rem; text-transform:uppercase; }
    .armor-slot.full{ width:100%; }
  .armor-stats{ font-size:0.9rem; color:var(--text-main); display:flex; gap:18px; justify-content:center; padding-left:6px; white-space:nowrap; overflow:visible; align-items:center; margin-top:6px; }
  /* label is muted, value uses accent-soft like weapons */
  .armor-stats .stat-label{ color:var(--text-muted); font-weight:700; margin-right:6px; }
  .armor-stats .stat-val{ color:var(--accent-soft); font-weight:900; min-width:20px; display:inline-block; text-align:left; }
    /* Ensure stats stay on one line on narrow screens; reduce font-size slightly if needed */
    @media (max-width:520px){
      .armor-grid{ flex-direction:row; }
      .armor-avatar-col{ flex:0 0 50%; }
      .armor-list-col{ flex:1 1 50%; }
      .armor-stats{ font-size:0.82rem; gap:8px; }
      .sheet-buttons{ grid-template-columns: 1fr; }
    }
    /* Tighter mobile rules to ensure right column fits within the panel */
    @media (max-width:480px) {
      .sheet-armor-panel { padding: 0.6rem; }
      .armor-grid{ gap:0.5rem; }
      /* make avatar a bit smaller, give more room to right column */
      .armor-avatar-col{ flex: 0 0 50%; }
      .armor-avatar-img{ max-width: 80%; }
      .armor-list-col{ flex: 0 0 44%; max-width:44%; min-width:140px; gap:0.5rem; }
      .armor-slot{ padding:5px 6px; font-size:0.82rem; border-radius:8px; }
      .armor-stats{ font-size:0.75rem; gap:6px; margin-top:3px; }
      .overlay-input{ font-size:0.92rem; padding:8px 10px; }
      .overlay-stats-row{ font-size:0.86rem; gap:8px; }
      .overlay-section{ gap:6px; }
    }
    /* Force overlay to be compact on small/mobile viewports */
    @media (max-width:480px) {
  /* Ensure overlay inner uses a fixed compact width (180px) when opened */
  /* prevent the inner from being stretched by its parent; use flex-basis for predictability */
  .armor-overlay{ overflow: visible !important; }
  .armor-overlay-inner{ flex: 0 0 180px !important; width: auto !important; padding:6px !important; border-radius:6px !important; box-sizing: border-box !important; }
      .overlay-title{ font-size:0.86rem !important; }
      .overlay-label{ font-size:0.68rem !important; letter-spacing:0.04em !important; }
      .overlay-input{ font-size:0.78rem !important; padding:6px 8px !important; }
      .overlay-list{ top:32px; max-height:120px; }
  /* ensure dropdowns match the inner width instead of stretching to the parent */
  .overlay-list{ left:0; right:auto; width:100%; box-sizing:border-box; }
      .overlay-stats-row{ font-size:0.72rem !important; gap:6px !important; }
      .overlay-stat .ov-av, .overlay-stat .ov-dr, .overlay-stat .ov-dur, .overlay-stat .ov-wt, .overlay-stat .ov-res { font-size:0.72rem !important; }
      .overlay-ok, .overlay-cancel{ font-size:0.72rem !important; padding:4px 6px !important; }
    }
  /* Armor overlay (fills right column area) */
  .armor-overlay{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:40; }
  .armor-overlay.be-hidden{ display:none; }
  .armor-overlay-inner{ width:100%; height:100%; background: var(--bg-panel-alt); padding:10px; box-sizing:border-box; color:var(--text-main); border-radius:8px; display:flex; flex-direction:column; gap:8px; font-size:0.86rem; line-height:1.05; overflow: visible; }
  .overlay-title{ font-weight:900; font-size:1.0rem; text-align:center; margin-bottom:4px; }
  .overlay-section{ background: transparent; padding:0; border-radius:6px; display:flex; flex-direction:column; gap:8px; }
  .overlay-label{ font-weight:900; color:var(--text-muted); font-size:0.78rem; letter-spacing:0.08em; }
  /* Inputs/selects in the overlay match weapon selector inputs */
  .overlay-select{ width:100%; padding:8px 10px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.28); color:var(--text-main); font-size:0.92rem; font-weight:800; box-sizing:border-box; }
  .overlay-select-wrap{ position:relative; }
  .overlay-input{ width:100%; padding:8px 10px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background: rgba(7, 9, 13, 0.9); color:var(--text-main); font-size:0.86rem; font-weight:700; box-sizing:border-box; }
  .overlay-list{ position:absolute; left:0; right:0; top:36px; max-height:140px; overflow:auto; background: rgba(11,11,11,0.98); color:#fff; border-radius:6px; box-shadow:0 8px 26px rgba(0,0,0,0.6); z-index:9999; }
  .overlay-item{ padding:8px 10px; cursor:pointer; border-bottom:1px solid rgba(0,0,0,0.06); }
  .overlay-item:hover, .overlay-item.hover{ background:rgba(255,255,255,0.03); }
  .overlay-stats-row{ display:flex; gap:10px; justify-content:flex-start; align-items:center; font-weight:700; font-size:0.82rem; }
  .overlay-stat{ color:var(--text-main); font-weight:700; }
  .overlay-stat .ov-av, .overlay-stat .ov-dr, .overlay-stat .ov-dur, .overlay-stat .ov-wt{ color:var(--accent-soft); font-weight:900; }
  /* make RES values even smaller and abbreviated */
  .overlay-stat .ov-res{ font-size:0.78rem; color:#f6c44d; font-weight:900; opacity:0.95; }
  .overlay-actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:auto; }
  .overlay-ok, .overlay-cancel{ padding:6px 8px; border-radius:6px; border:0; cursor:pointer; font-weight:800; font-size:0.82rem; }
  .overlay-ok{ background: rgba(0,0,0,0.6); color:var(--text-main); border-radius:6px; padding:6px 10px; }
  .overlay-cancel{ background: rgba(0,0,0,0.38); color:var(--text-main); border-radius:6px; padding:6px 10px; }
  `;
  document.head.appendChild(s);
}

// Weapons panel styles
function injectWeaponStylesOnce(){
  if ($('#_beWeaponStyles')) return;
  const s = document.createElement('style');
  s.id = '_beWeaponStyles';
  s.textContent = `
  .sheet-weapons-panel{ max-width:900px; margin: 1rem auto; padding: 0.85rem 1rem; background: var(--bg-panel); border-radius: 12px; }
  .weapons-grid{ display:flex; flex-direction:column; gap:0.6rem; }
  .weapon-row{ display:flex; gap:0.6rem; align-items:flex-start; padding:6px 8px; background: linear-gradient(180deg,#171818,#111213); border-radius:8px; border:1px solid rgba(255,255,255,0.04); position:relative; }
  .weapon-left{ display:flex; flex-direction:column; align-items:center; gap:8px; width:86px; flex:0 0 86px; }
  .weapon-label{ font-weight:900; text-transform:uppercase; letter-spacing:0.12em; font-size:0.85rem; }
  .weapon-image-box{ width:64px; height:64px; background:#0d0d0f; border-radius:6px; border:1px solid rgba(255,255,255,0.04); background-size:cover; background-position:center center; box-shadow: none; }
  .weapon-main{ flex:1 1 auto; display:flex; flex-direction:column; gap:6px; }
  /* compact selector + type grouping */
  /* weapon-selector is now plain text styled like weapon-type but white */
  .weapon-selector{ text-align:left; padding:0; border-radius:0; border:0; background: transparent; color: #ffffff; font-weight:800; cursor:pointer; min-width:120px; display:inline-block; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .weapon-selector:active{ transform: none; }
  /* small spacing between selector and type */
  .weapon-selector{ margin-right:6px; }
  .weapon-type{ font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:var(--accent); font-size:0.82rem; }
  .weapon-type.two-line{ display:flex; flex-direction:row; gap:6px; align-items:center; font-size:0.82rem; }
  .weapon-type.two-line .type-top, .weapon-type.two-line .type-bottom{ display:inline-block; }
  .weapon-type.two-line .type-bottom{ color: var(--accent-soft); }
  /* Stats: keep compact and allow wrapping into two rows */
  .weapon-stats{ display:flex; gap:10px; align-items:flex-start; margin-top:4px; flex-wrap:wrap; }
  .weapon-stats .stat{ display:flex; flex-direction:column; align-items:center; min-width:62px; max-width:120px; }
  .stat-label{ font-size:0.68rem; color:var(--text-muted); font-weight:800; }
  .stat-val{ font-size:1rem; font-weight:900; color:var(--accent-soft); line-height:1; }
  /* Dice stays right-aligned on wide view, but is repositioned on narrow screens */
  .weapon-dice{ display:flex; flex-direction:column; gap:4px; align-items:flex-end; width:132px; flex:0 0 132px; }
  .dice-label{ font-size:0.56rem; color:var(--text-muted); text-transform:uppercase; }
  .dice-val{ font-weight:900; color:var(--accent); }
  /* overlay the entire weapon-row when opened */
  .weapon-list{ position:absolute; inset:0; background: rgba(11,11,11,0.98); color:#fff; border-radius:8px; border:1px solid rgba(255,255,255,0.06); box-shadow:0 8px 26px rgba(0,0,0,0.6); max-height:none; overflow:auto; z-index:120; padding:10px; box-sizing:border-box; }
  .weapon-list .weapon-item{ padding:8px; border-radius:6px; cursor:pointer; }
  .weapon-list .weapon-item:hover{ background:rgba(255,255,255,0.03); }
  /* Compact range band block: inline labels to save vertical space */
  .range-band-block{ background:linear-gradient(90deg,#3a220f,#4a2e12); padding:6px; border-radius:6px; color:#fff; display:flex; gap:8px; align-items:flex-start; }
  .rb-title{ font-weight:900; font-size:0.72rem; margin-right:6px; }
  .rb-row{ display:flex; gap:6px; align-items:center; flex-direction:column; }
  .rb-label{ font-weight:900; color:#111; background:var(--accent-soft); padding:2px 6px; border-radius:6px; font-size:0.64rem; }
  .rb-val{ color:#ffe9c8; font-weight:900; font-size:0.76rem; }

  /* MELEE: style the RANGE stat box to match range-band-block */
  .weapon-row[data-category="Melee"] .weapon-stats .stat:last-child{ background:linear-gradient(90deg,#3a220f,#4a2e12); padding:6px; border-radius:6px; color:#fff; display:flex; align-items:center; gap:8px; }
  .weapon-row[data-category="Melee"] .weapon-stats .stat:last-child .stat-label{ font-weight:900; color:#111; background:var(--accent-soft); padding:2px 6px; border-radius:6px; font-size:0.64rem; }
  .weapon-row[data-category="Melee"] .weapon-stats .stat:last-child .stat-val.range{ color:#ffe9c8; font-weight:900; font-size:0.76rem; }

  /* Mobile / narrow screens: keep rows compact, move dice up, align header elements */
  @media (max-width:520px){
    .weapon-row{ flex-direction:row; align-items:flex-start; padding:6px; }
    .weapon-left{ flex:0 0 70px; width:70px; }
    .weapon-main{ flex:1 1 auto; margin-right:8px; }
    /* Move dice to top-right of the card to be closer to name/type */
    .weapon-dice{ position:absolute; right:8px; top:8px; width:auto; align-items:flex-end; }
  /* on mobile still overlay the row, ensure it fits within the row bounds */
  .weapon-list{ inset:0; padding:10px; }
    /* General stats spacing */
    .weapon-stats{ gap:8px; }
    .weapon-stats .stat{ min-width:56px; }

    /* RANGED SLOT: Ensure small-stats are a single horizontal row */
    .weapon-row[data-category="Ranged"] .weapon-stats{ display:flex; flex-direction:column; align-items:stretch; }
    .weapon-row[data-category="Ranged"] .weapon-stats .small-stats{ display:flex; flex-direction:row; gap:8px; justify-content:space-between; flex-wrap:nowrap; width:100%; }
    .weapon-row[data-category="Ranged"] .weapon-stats .small-stats .stat{ flex:1 1 0; display:flex; flex-direction:column; align-items:center; min-width:0; }

    /* Range bands centered below the small-stats row */
  .weapon-row[data-category="Ranged"] .weapon-stats .range-band-block{ order:2; align-self:center; margin:6px auto 4px; padding:6px 10px; display:flex; gap:12px; align-items:flex-start; justify-content:center; }
  .weapon-row[data-category="Ranged"] .weapon-stats .range-band-block .rb-row{ flex-direction:row; align-items:flex-start; gap:10px; }

    /* Make placeholders compact and same footprint as values */
    .stat-val{ min-height:20px; display:inline-flex; align-items:center; justify-content:center; }
  }
  /* Make dice label smaller and right-justify the dice block within each weapon-row */
  .weapon-row .weapon-dice{ margin-left: auto; display:flex; flex-direction:column; align-items:flex-end; }
  .weapon-row .dice-label{ font-size:0.52rem; opacity:0.9; }
  /* Limit selector width so it doesn't stretch too far right; allow it to grow but cap it */
  .weapon-selector{ max-width:70%; min-width:120px; }
  @media (max-width:520px){
    .weapon-selector{ max-width:72%; }
  }
  `;
  document.head.appendChild(s);
}

// Render weapons panel placeholders and wire handlers
function renderWeaponsPanel(){
  injectWeaponStylesOnce();
  // Wire each weapon-row selector to open a list
  $all('.weapon-row').forEach(row => {
    if (row.dataset.bound) return;
    row.dataset.bound = '1';
    const selector = row.querySelector('.weapon-selector');
    const list = row.querySelector('.weapon-list');
    selector.addEventListener('click', async (e) => {
      e.stopPropagation();
      // ensure data loaded
      await ensureDataLoaded();
      populateWeaponListForRow(row);
      list.classList.toggle('be-hidden');
      list.setAttribute('aria-hidden', list.classList.contains('be-hidden') ? 'true' : 'false');
    });

    // Open the dropdown when clicking anywhere in the row (but not when clicking inside the list itself)
    row.addEventListener('click', async (e) => {
      // if click happened inside the list, ignore (list handles its own clicks)
      if (e.target.closest('.weapon-list')) return;
      // if the click target is the list toggle itself, the selector handler will run; avoid double-handling
      if (e.target.closest('.weapon-selector')) return;
      e.stopPropagation();
      await ensureDataLoaded();
      populateWeaponListForRow(row);
      // show the list
      list.classList.remove('be-hidden');
      list.setAttribute('aria-hidden', 'false');
    });

    // close list when clicking outside
    document.addEventListener('click', (ev) => {
      if (!row.contains(ev.target)) {
        list.classList.add('be-hidden');
        list.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

function populateWeaponListForRow(row){
  const cat = (row.dataset.category || '').toLowerCase();
  const list = row.querySelector('.weapon-list');
  if (!list) return;
  list.innerHTML = '';
  const options = (weaponsData || []).filter(w => normalize(w.category) === cat);
  options.sort((a,b)=> (a.name||'').localeCompare(b.name||''));
  options.forEach(item => {
    const div = document.createElement('div');
    div.className = 'weapon-item';
    div.textContent = item.name + (item.type ? (' — ' + item.type) : '');
    div.addEventListener('click', (e) => {
      e.stopPropagation();
      applyWeaponToRow(row, item);
      list.classList.add('be-hidden');
      list.setAttribute('aria-hidden', 'true');
    });
    list.appendChild(div);
  });
}

function applyWeaponToRow(row, item){
  if (!row || !item) return;
  const imgBox = row.querySelector('.weapon-image-box');
  const selector = row.querySelector('.weapon-selector');
  const typeEl = row.querySelector('.weapon-type');
  const dicePool = row.querySelector('.dice-pool');
  const diceSize = row.querySelector('.dice-size');

  // set image if item.image exists, otherwise try item.icon, otherwise attempt an assets/weapon-<slug>.png lookup
  let appliedImageUrl = null;
  if (item && item.image) appliedImageUrl = item.image;
  else if (item && item.icon) appliedImageUrl = item.icon;
  else if (item && item.name) {
    // slugify the weapon name: lowercase, replace non-alnum with hyphens, trim hyphens
    const slug = (item.name || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (slug) appliedImageUrl = `assets/weapon-${slug}.png`;
  }

  if (imgBox) {
    if (!appliedImageUrl) {
      imgBox.style.backgroundImage = '';
    } else {
      // preload image and only set background if it loads successfully
      const _img = new Image();
      _img.onload = () => { try { imgBox.style.backgroundImage = `url(${appliedImageUrl})`; } catch (e) {} };
      _img.onerror = () => { try { imgBox.style.backgroundImage = ''; } catch (e) {} };
      _img.src = appliedImageUrl;
    }
  }
  if (selector) selector.textContent = item.name || selector.dataset.placeholder || selector.textContent;

  // type / descriptor
  if (typeEl) {
    if (row.dataset.category && row.dataset.category.toLowerCase() === 'melee') {
      typeEl.textContent = (item.type || '--').toUpperCase();
    } else {
      // ranged: show type and description stacked
      const top = typeEl.querySelector('.type-top');
      const bot = typeEl.querySelector('.type-bottom');
      if (top) top.textContent = (item.type || '--').toUpperCase();
      if (bot) bot.textContent = (item.description || '--');
    }
  }

  // dice
  if (dicePool) dicePool.textContent = item.diePool != null ? String(item.diePool) : '--';
  if (diceSize) diceSize.textContent = item.dieSize != null ? String(item.dieSize).toUpperCase() : '--';

  // stats
  const dam = row.querySelector('.stat-val.dam');
  const pen = row.querySelector('.stat-val.pen');
  const dur = row.querySelector('.stat-val.dur');
  const hands = row.querySelector('.stat-val.hands');
  const wt = row.querySelector('.stat-val.wt');
  const range = row.querySelector('.stat-val.range');
  if (dam) dam.textContent = item.damage != null ? String(item.damage) : '--';
  if (pen) pen.textContent = item.penetration != null ? String(item.penetration) : '--';
  if (dur) dur.textContent = item.durability != null ? String(item.durability) : '--';
  if (hands) hands.textContent = item.hands != null ? String(item.hands) : '--';
  if (wt) wt.textContent = item.weight != null ? String(item.weight) : (item.wt != null ? String(item.wt) : '--');
  if (range) range.textContent = item.range != null ? String(item.range) : (item.rangeBands ? '--' : '--');

  // ranged range bands
  const rbClse = row.querySelector('.rb-clse');
  const rbEff = row.querySelector('.rb-eff');
  const rbFar = row.querySelector('.rb-far');
  const rbMax = row.querySelector('.rb-max');
  if (rbClse) rbClse.textContent = (item.rangeBands && (item.rangeBands.close || item.rangeBands.clse)) || '--';
  if (rbEff) rbEff.textContent = (item.rangeBands && (item.rangeBands.effective || item.rangeBands.eff)) || '--';
  if (rbFar) rbFar.textContent = (item.rangeBands && (item.rangeBands.far)) || '--';
  if (rbMax) rbMax.textContent = (item.rangeBands && (item.rangeBands.max)) || '--';

  // Persist the selected weapon into weaponsState so it can be saved with the character
  try {
    const slot = row.dataset.slot;
    if (slot) {
      // store a minimal snapshot of the selected weapon to avoid depending on weaponsData later
  weaponsState[slot] = {
        name: item.name || null,
        diePool: item.diePool != null ? item.diePool : null,
        dieSize: item.dieSize != null ? item.dieSize : null,
        damage: item.damage != null ? item.damage : null,
        penetration: item.penetration != null ? item.penetration : null,
        durability: item.durability != null ? item.durability : null,
        hands: item.hands != null ? item.hands : null,
        weight: item.weight != null ? item.weight : (item.wt != null ? item.wt : null),
        range: item.range != null ? item.range : null,
        rangeBands: item.rangeBands || null,
        image: appliedImageUrl || null,
        category: item.category || null
      };
      // if a character is active, persist immediately
      persistActiveCharacterState();
    }
  } catch (e) { console.error('Failed to persist weapon selection', e); }
}

function toast(msg) {
  let el = $("#beToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "beToast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => el.classList.remove("show"), 1600);
}

// show a persistent data error banner (useful for editors to see fetch failures)
function showDataError(detail) {
  let existing = document.getElementById('_beDataError');
  if (!existing) {
    existing = document.createElement('div');
    existing.id = '_beDataError';
    existing.style.cssText = 'position:fixed;left:16px;right:16px;top:16px;background:#6b0000;color:#fff;padding:12px;border-radius:8px;z-index:9999;font-size:0.95rem;box-shadow:0 8px 24px rgba(0,0,0,0.6);';
    document.body.appendChild(existing);
  }
  existing.textContent = 'Data load error: ' + detail;
}

/* ===================================================
   3) APP “VIEWS” (HOME / SHEET / COMPENDIUM)
=================================================== */

let compendiumRoot = null;
let homeScreen = null;
let sheetScreen = null;

function ensureScreens() {
  injectSheetStylesOnce();
  // install app-like behaviors (block image context menu / drag)
  try { installAppLikeBehaviors(); } catch(e) { /* ignore */ }

  // initialize import input so Import menu works
  initImportInput();

  // The existing compendium is already inside #app (your current site).
  compendiumRoot = $("#app");
  if (!compendiumRoot) {
    // If #app is missing, we can’t safely proceed.
    console.error("Missing #app container. Your index.html should have <div id='app'>...</div>.");
    return;
  }

  // Create Home screen (insert before compendium)
  if (!$("#homeScreen")) {
    homeScreen = document.createElement("div");
    homeScreen.id = "homeScreen";
    homeScreen.innerHTML = `
      <div class="home-wrap">
        <img class="home-logo" src="assets/BlightsEnd-Logo.png" alt="BlightsEnd" />
        <button class="home-btn" id="btnGoSheet">Character Sheet</button>
        <button class="home-btn" id="btnGoCompendium">Compendium</button>
      </div>
    `;
    compendiumRoot.parentNode.insertBefore(homeScreen, compendiumRoot);
  } else {
    homeScreen = $("#homeScreen");
  }

  // Create Character Sheet screen (insert after home, before compendium)
  if (!$("#sheetScreen")) {
    sheetScreen = document.createElement("div");
    sheetScreen.id = "sheetScreen";
    sheetScreen.classList.add("be-hidden");
    sheetScreen.innerHTML = `
      <div class="sheet-header">
        <button class="sheet-menu-btn" id="openSheetMenu" type="button">
          <span style="font-size:1.1rem; line-height:0;">☰</span> <span>Menu</span>
        </button>
        <button class="sheet-title-btn" id="sheetLogoBtn" type="button" aria-label="Home">
          <img class="sheet-title-logo" src="assets/BlightsEnd-Logo.png" alt="BlightsEnd" />
        </button>
        <div style="width:64px;"></div>
      </div>

  <section class="sheet-card">
        <div class="sheet-grid-top">
          <div>
            <div class="field-label">Name</div>
            <input class="be-text" id="cs_name" type="text" placeholder="Name" autocomplete="off" />
          </div>
          <div>
            <div class="field-label">HP</div>
            <div class="hp-pair">
              ${numField("cs_hp")}
              ${numField("cs_hp_max")}
            </div>
          </div>
        </div>

  <div class="sheet-row">
          <div>
            <div class="field-label">Stamina</div>
            ${numField("cs_stamina")}
          </div>
          <div>
            <div class="field-label">Ephem</div>
            ${numField("cs_ephem")}
          </div>
          <div>
            <div class="field-label">Walk</div>
            ${numField("cs_walk")}
          </div>
          <div>
            <div class="field-label">Run</div>
            ${numField("cs_run")}
          </div>
        </div>

        <div class="stat-strip">
          <div>
            <div class="field-label">Fight</div>
            ${numField("cs_fight")}
          </div>
          <div>
            <div class="field-label">Volley</div>
            ${numField("cs_volley")}
          </div>
          <div>
            <div class="field-label">Guts</div>
            ${numField("cs_guts")}
          </div>
          <div>
            <div class="field-label">Grit</div>
            ${numField("cs_grit")}
          </div>
          <div>
            <div class="field-label">Focus</div>
            ${numField("cs_focus")}
          </div>
        </div>

        <div class="sheet-buttons">
          <button class="sheet-action" type="button" id="cs_btn_echoes">Echoes</button>
          <button class="sheet-action" type="button" id="cs_btn_gear">Gear</button>
          <button class="sheet-action" type="button" id="cs_btn_backpack">Backpack</button>
        </div>

        <!-- Armor panel mockup -->
        <section class="sheet-armor-panel">
          <h2 style="text-align:center;margin:0.2rem 0 0.6rem;">ARMOR</h2>
          <div class="armor-grid">
            <div class="armor-avatar-col">
              <img src="assets/armor-avatar.png" alt="Avatar" class="armor-avatar-img" />
            </div>
            <div class="armor-list-col">
              <div class="armor-row">
                <button class="armor-slot full" data-slot="head">HEAD</button>
                <div class="armor-stats"><span class="stat-label">AV:</span> <span class="stat-val av">--</span> <span class="stat-label">AR:</span> <span class="stat-val ar">--</span> <span class="stat-label">DUR:</span> <span class="stat-val dur">--</span></div>
              </div>
              <div class="armor-row">
                <button class="armor-slot full" data-slot="torso">TORSO</button>
                <div class="armor-stats"><span class="stat-label">AV:</span> <span class="stat-val av">--</span> <span class="stat-label">AR:</span> <span class="stat-val ar">--</span> <span class="stat-label">DUR:</span> <span class="stat-val dur">--</span></div>
              </div>
              <div class="armor-row">
                <button class="armor-slot full" data-slot="leftArm">LEFT ARM</button>
                <div class="armor-stats"><span class="stat-label">AV:</span> <span class="stat-val av">--</span> <span class="stat-label">AR:</span> <span class="stat-val ar">--</span> <span class="stat-label">DUR:</span> <span class="stat-val dur">--</span></div>
              </div>
              <div class="armor-row">
                <button class="armor-slot full" data-slot="rightArm">RIGHT ARM</button>
                <div class="armor-stats"><span class="stat-label">AV:</span> <span class="stat-val av">--</span> <span class="stat-label">AR:</span> <span class="stat-val ar">--</span> <span class="stat-label">DUR:</span> <span class="stat-val dur">--</span></div>
              </div>
              <div class="armor-row">
                <button class="armor-slot full" data-slot="leftLeg">LEFT LEG</button>
                <div class="armor-stats"><span class="stat-label">AV:</span> <span class="stat-val av">--</span> <span class="stat-label">AR:</span> <span class="stat-val ar">--</span> <span class="stat-label">DUR:</span> <span class="stat-val dur">--</span></div>
              </div>
              <div class="armor-row">
                <button class="armor-slot full" data-slot="rightLeg">RIGHT LEG</button>
                <div class="armor-stats"><span class="stat-label">AV:</span> <span class="stat-val av">--</span> <span class="stat-label">AR:</span> <span class="stat-val ar">--</span> <span class="stat-label">DUR:</span> <span class="stat-val dur">--</span></div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Weapons panel -->
        <section class="sheet-weapons-panel">
          <h2 style="text-align:center;margin:0.2rem 0 0.6rem;">WEAPONS</h2>
          <div class="weapons-grid">
            <!-- MELEE Slot #1 -->
            <div class="weapon-row" data-slot="melee1" data-category="Melee">
              <div class="weapon-left">
                <div class="weapon-label">MELEE</div>
                <div class="weapon-image-box" aria-hidden="true"></div>
              </div>
              <div class="weapon-main">
                <div class="weapon-selector" data-placeholder="Select Weapon">Select Weapon</div>
                <div class="weapon-type">--</div>
                <div class="weapon-stats melee-stats">
                  <div class="stat"><div class="stat-label">DAM</div><div class="stat-val dam">--</div></div>
                  <div class="stat"><div class="stat-label">PEN</div><div class="stat-val pen">--</div></div>
                  <div class="stat"><div class="stat-label">DUR</div><div class="stat-val dur">--</div></div>
                  <div class="stat"><div class="stat-label">HANDS</div><div class="stat-val hands">--</div></div>
                  <div class="stat"><div class="stat-label">WT</div><div class="stat-val wt">--</div></div>
                  <div class="stat"><div class="stat-label">RANGE</div><div class="stat-val range">--</div></div>
                </div>
              </div>
              <div class="weapon-dice">
                <div class="dice-label">DP/DS</div>
                <div class="dice-val"><span class="dice-pool">--</span> <span class="dice-size">--</span></div>
              </div>
              <div class="weapon-list be-hidden" aria-hidden="true"></div>
            </div>

            <!-- MELEE Slot #2 -->
            <div class="weapon-row" data-slot="melee2" data-category="Melee">
              <div class="weapon-left">
                <div class="weapon-label">MELEE</div>
                <div class="weapon-image-box" aria-hidden="true"></div>
              </div>
              <div class="weapon-main">
                <div class="weapon-selector" data-placeholder="Select Weapon">Select Weapon</div>
                <div class="weapon-type">--</div>
                <div class="weapon-stats melee-stats">
                  <div class="stat"><div class="stat-label">DAM</div><div class="stat-val dam">--</div></div>
                  <div class="stat"><div class="stat-label">PEN</div><div class="stat-val pen">--</div></div>
                  <div class="stat"><div class="stat-label">DUR</div><div class="stat-val dur">--</div></div>
                  <div class="stat"><div class="stat-label">HANDS</div><div class="stat-val hands">--</div></div>
                  <div class="stat"><div class="stat-label">WT</div><div class="stat-val wt">--</div></div>
                  <div class="stat"><div class="stat-label">RANGE</div><div class="stat-val range">--</div></div>
                </div>
              </div>
              <div class="weapon-dice">
                <div class="dice-label">DP/DS</div>
                <div class="dice-val"><span class="dice-pool">--</span> <span class="dice-size">--</span></div>
              </div>
              <div class="weapon-list be-hidden" aria-hidden="true"></div>
            </div>

            <!-- RANGED Slot #1 -->
            <div class="weapon-row" data-slot="ranged1" data-category="Ranged">
              <div class="weapon-left">
                <div class="weapon-label">RANGED</div>
                <div class="weapon-image-box" aria-hidden="true"></div>
              </div>
              <div class="weapon-main">
                <div class="weapon-selector" data-placeholder="Select Weapon">Select Weapon</div>
                <div class="weapon-type two-line"><div class="type-top">--</div><div class="type-bottom">--</div></div>
                <div class="weapon-stats ranged-stats">
                  <div class="small-stats">
                    <div class="stat"><div class="stat-label">DAM</div><div class="stat-val dam">--</div></div>
                    <div class="stat"><div class="stat-label">PEN</div><div class="stat-val pen">--</div></div>
                    <div class="stat"><div class="stat-label">HANDS</div><div class="stat-val hands">--</div></div>
                    <div class="stat"><div class="stat-label">WT</div><div class="stat-val wt">--</div></div>
                  </div>
                </div>
                <div class="range-band-block">
                  <div class="rb-title">RANGE BANDS</div>
                  <div class="rb-row"><div class="rb-label">CLSE</div><div class="rb-val rb-clse">--</div></div>
                  <div class="rb-row"><div class="rb-label">EFF</div><div class="rb-val rb-eff">--</div></div>
                  <div class="rb-row"><div class="rb-label">FAR</div><div class="rb-val rb-far">--</div></div>
                  <div class="rb-row"><div class="rb-label">MAX</div><div class="rb-val rb-max">--</div></div>
                </div>
              </div>
              <div class="weapon-dice">
                <div class="dice-label">DP/DS</div>
                <div class="dice-val"><span class="dice-pool">--</span> <span class="dice-size">--</span></div>
              </div>
              <div class="weapon-list be-hidden" aria-hidden="true"></div>
            </div>
          </div>
        </section>
      </section>

      

      <div id="sheetMenuOverlay" aria-hidden="true">
        <div class="sheet-menu-modal" role="dialog" aria-modal="true" aria-label="Character Sheet Menu">
          <div class="sheet-menu-title">Menu</div>
          <div class="sheet-menu-list">
            <button class="sheet-menu-item" type="button" data-action="home">Home</button>
            <button class="sheet-menu-item" type="button" data-action="save">Save Character</button>
            <button class="sheet-menu-item" type="button" data-action="load">Load Character</button>
                <button class="sheet-menu-item" type="button" data-action="export">Export Character</button>
                <button class="sheet-menu-item" type="button" data-action="import">Import Character</button>
            <button class="sheet-menu-item" type="button" data-action="compendium">Open Compendium</button>
            <button class="sheet-menu-item" type="button" data-action="close">Close</button>
          </div>
        </div>
      </div>
    `;
    compendiumRoot.parentNode.insertBefore(sheetScreen, compendiumRoot);
  } else {
    sheetScreen = $("#sheetScreen");
  }

  // Hide compendium by default (home first)
  compendiumRoot.classList.add("be-hidden");

  // Wire home buttons once
  const btnGoSheet = $("#btnGoSheet");
  const btnGoCompendium = $("#btnGoCompendium");
  if (btnGoSheet && !btnGoSheet.dataset.bound) {
    btnGoSheet.dataset.bound = "1";
    btnGoSheet.addEventListener("click", () => {
      // Always switch view immediately, even if hash is already set
      location.hash = "#sheet";
      showOnly("sheet");
    });
  }
  if (btnGoCompendium && !btnGoCompendium.dataset.bound) {
    btnGoCompendium.dataset.bound = "1";
    btnGoCompendium.addEventListener("click", () => {
      location.hash = "#compendium";
      showOnly("compendium");
    });
  }

  // Wire sheet menu overlay once
  const openSheetMenu = $("#openSheetMenu");
  if (openSheetMenu && !openSheetMenu.dataset.bound) {
    openSheetMenu.dataset.bound = "1";
    openSheetMenu.addEventListener("click", () => toggleSheetMenu(true));
  }
  // Wire sheet logo button to navigate home
  const sheetLogoBtn = $("#sheetLogoBtn");
  if (sheetLogoBtn && !sheetLogoBtn.dataset.bound) {
    sheetLogoBtn.dataset.bound = "1";
    sheetLogoBtn.addEventListener("click", () => {
      navigate("home");
    });
  }
  const overlay = $("#sheetMenuOverlay");
  if (overlay && !overlay.dataset.bound) {
    overlay.dataset.bound = "1";
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) toggleSheetMenu(false);
    });
    overlay.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      handleSheetMenuAction(action);
    });
  }

  // Bind steppers + local persistence
  bindAllSteppers();
  loadActiveCharacterIfAny();

  // Render armor UI placeholders
  renderArmorPanel();
  // Render weapons UI placeholders
  renderWeaponsPanel();
}

// ---------------------- Export / Import helpers ----------------------
function exportActiveCharacter() {
  const active = localStorage.getItem(STORAGE_KEY_ACTIVE);
  const saved = readSavedCharacters();
  const data = (active && saved[active]) ? saved[active] : getSheetState();
  // build enriched export: include full armor items and weapon objects where possible
  const enriched = JSON.parse(JSON.stringify(data));
  // expand armor layers to full items
  if (enriched.armor && Array.isArray(Object.keys(enriched.armor))) {
    Object.keys(enriched.armor).forEach(slotKey => {
      const slot = enriched.armor[slotKey] || {};
      const layers = slot.layers || {};
      const expandedLayers = {};
      ['base','mid','outer'].forEach(layerName => {
        const sel = layers[layerName];
        if (!sel) return expandedLayers[layerName] = null;
        const item = armorData.find(a => a.name === sel) || null;
        expandedLayers[layerName] = item || { name: sel };
      });
      // attach expanded layer objects under _items for clarity
      enriched.armor[slotKey].layerItems = expandedLayers;
    });
  }

  // expand weapons to full objects
  if (enriched.weapons && typeof enriched.weapons === 'object') {
    Object.keys(enriched.weapons).forEach(slotKey => {
      const w = enriched.weapons[slotKey];
      if (!w) return;
      const found = weaponsData.find(item => item.name === w.name) || null;
      enriched.weapons[slotKey].item = found || w;
    });
  }

  const out = {
    __format: 'be-character-v1',
    exportedAt: new Date().toISOString(),
    character: enriched
  };
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(data.name || 'character')}.bechar.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast('Character exported to file.');
}

function initImportInput() {
  let input = document.getElementById('_beImportInput');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.id = '_beImportInput';
    input.accept = '.json,.bechar.json,application/json';
    input.style.display = 'none';
    input.addEventListener('change', (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (f) importCharacterFile(f);
      input.value = '';
    });
    document.body.appendChild(input);
  }
}

async function importCharacterFile(file) {
  const text = await file.text();
  try {
    const parsed = JSON.parse(text);
    const candidate = parsed.character || parsed;
    if (!candidate || !candidate.name) {
      toast('Imported file seems invalid (missing name).');
      return;
    }
    // save into saved characters and load it
    const saved = readSavedCharacters();
    saved[candidate.name] = candidate;
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(saved));
    setSheetState(candidate);
    localStorage.setItem(STORAGE_KEY_ACTIVE, candidate.name);
    toast(`Imported and loaded: ${candidate.name}`);
  } catch (err) {
    console.error(err);
    toast('Failed to import character file (invalid JSON).');
  }
}

function numField(id) {
  // numbers only + custom stepper buttons
  return `
    <div class="num-wrap" data-numwrap="${id}">
      <input
        class="be-num"
        id="${id}"
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        step="1"
        value="0"
      />
      <div class="stepper" aria-hidden="true">
        <button type="button" data-step="up">▲</button>
        <button type="button" data-step="down">▼</button>
      </div>
    </div>
  `;
}

function showOnly(view) {
  if (!homeScreen || !sheetScreen) return;

  const compendiumScreen = document.getElementById("compendiumScreen");

  homeScreen.classList.toggle("be-hidden", view !== "home");
  sheetScreen.classList.toggle("be-hidden", view !== "sheet");
  if (compendiumScreen) compendiumScreen.classList.toggle("be-hidden", view !== "compendium");

  // close modal overlays when switching
  toggleSheetMenu(false);

  // When entering compendium, ensure it's initialized and rendered once
  if (view === "compendium") {
    initCompendiumOnce().catch(console.error);
  }
}

function navigate(view) {
  // hash routing so it remembers
  const map = { home: "#home", sheet: "#sheet", compendium: "#compendium" };
  const h = map[view] || "#home";
  if (location.hash !== h) location.hash = h;
  showOnly(view);
}

/* ===================================================
   4) CHARACTER SHEET: SAVE / LOAD / STEPPERS
=================================================== */

const STORAGE_KEY_ACTIVE = "be_active_character";
const STORAGE_KEY_SAVED = "be_saved_characters"; // object map by name

function getSheetState() {
  const getNum = (id) => {
    const el = $("#" + id);
    const v = el ? Number(el.value) : 0;
    return Number.isFinite(v) ? v : 0;
  };
  return {
    name: ($("#cs_name")?.value || "").trim(),
    hp: getNum("cs_hp"),
  hpMax: getNum("cs_hp_max"),
    stamina: getNum("cs_stamina"),
    ephem: getNum("cs_ephem"),
    walk: getNum("cs_walk"),
    run: getNum("cs_run"),
    fight: getNum("cs_fight"),
    volley: getNum("cs_volley"),
    guts: getNum("cs_guts"),
    grit: getNum("cs_grit"),
    focus: getNum("cs_focus"),
    // include armor state so it persists with the character
    armor: JSON.parse(JSON.stringify(armorState || {})),
    // include weapon selections so they persist with the character
    weapons: JSON.parse(JSON.stringify(weaponsState || {})),
    updatedAt: Date.now()
  };
}

// Persistable state includes armor layers and computed sums so we can reload UI exactly

function setSheetState(state) {
  if (!state) return;
  if ($("#cs_name")) $("#cs_name").value = state.name || "";

  const setNum = (id, val) => {
    const el = $("#" + id);
    if (!el) return;
    const n = Number(val);
    el.value = Number.isFinite(n) ? String(n) : "0";
  };

  setNum("cs_hp", state.hp);
  setNum("cs_hp_max", state.hpMax);
  setNum("cs_stamina", state.stamina);
  setNum("cs_ephem", state.ephem);
  setNum("cs_walk", state.walk);
  setNum("cs_run", state.run);
  setNum("cs_fight", state.fight);
  setNum("cs_volley", state.volley);
  setNum("cs_guts", state.guts);
  setNum("cs_grit", state.grit);
  setNum("cs_focus", state.focus);
  // restore armor if present
  if (state.armor) {
    try {
      // deep copy to avoid shared references
      Object.keys(armorState).forEach(k => delete armorState[k]);
      Object.assign(armorState, JSON.parse(JSON.stringify(state.armor || {})));
      renderArmorPanel();
    } catch (e) { console.error('Failed to restore armor state', e); }
  }
  // restore weapons if present
  if (state.weapons) {
    try {
      Object.keys(weaponsState).forEach(k => delete weaponsState[k]);
      Object.assign(weaponsState, JSON.parse(JSON.stringify(state.weapons || {})));
      // re-apply weapons to the UI rows so the sheet reflects saved selections
      $all('.weapon-row').forEach(row => {
        const slot = row.dataset.slot;
        const saved = weaponsState[slot];
        if (saved && saved.name) {
          // try to find the weapon by name in loaded weaponsData, fallback to saved object
          const found = (weaponsData || []).find(w => w.name === saved.name) || saved;
          applyWeaponToRow(row, found);
        }
      });
    } catch (e) { console.error('Failed to restore weapons state', e); }
  }
}

// When armor changes, persist it into the currently active saved character (if any)
function persistActiveCharacterState(){
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (!active) return;
    const saved = readSavedCharacters();
    const cur = saved[active] || {};
    cur.armor = JSON.parse(JSON.stringify(armorState || {}));
    // persist weapon selections as well
    cur.weapons = JSON.parse(JSON.stringify(weaponsState || {}));
    cur.updatedAt = Date.now();
    saved[active] = cur;
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(saved));
  } catch (e) {
    console.error('Failed to persist active character armor state', e);
  }
}

function saveCharacter() {
  const state = getSheetState();
  if (!state.name) {
    toast("Give your character a Name first.");
    return;
  }
  const saved = readSavedCharacters();
  saved[state.name] = state;
  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(saved));
  localStorage.setItem(STORAGE_KEY_ACTIVE, state.name);
  toast(`Saved: ${state.name}`);
}

function loadCharacter(name) {
  const saved = readSavedCharacters();
  const state = saved[name];
  if (!state) {
    toast("Could not find that character.");
    return;
  }
  setSheetState(state);
  localStorage.setItem(STORAGE_KEY_ACTIVE, name);
  toast(`Loaded: ${name}`);
}

function loadActiveCharacterIfAny() {
  const active = localStorage.getItem(STORAGE_KEY_ACTIVE);
  if (!active) return;
  const saved = readSavedCharacters();
  if (saved[active]) setSheetState(saved[active]);
}

function readSavedCharacters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function toggleSheetMenu(show) {
  const overlay = $("#sheetMenuOverlay");
  if (!overlay) return;
  overlay.classList.toggle("show", !!show);
  overlay.setAttribute("aria-hidden", show ? "false" : "true");
}

function handleSheetMenuAction(action) {
  switch (action) {
    case "home":
      toggleSheetMenu(false);
      navigate("home");
      return;
    case "compendium":
      toggleSheetMenu(false);
      navigate("compendium");
      return;
    case "save":
      toggleSheetMenu(false);
      saveCharacter();
      return;
    case "export":
      toggleSheetMenu(false);
      exportActiveCharacter();
      return;
    case "import":
      toggleSheetMenu(false);
      // open the hidden file input
      initImportInput();
      const inp = document.getElementById('_beImportInput');
      if (inp) inp.click();
      return;
    case "load": {
      toggleSheetMenu(false);
      const saved = readSavedCharacters();
      const names = Object.keys(saved);
      if (!names.length) {
        toast("No saved characters yet.");
        return;
      }
      // simple chooser prompt (we can upgrade this to a nice modal later)
      const chosen = prompt(
        "Type a character name to load:\n\n" + names.join("\n")
      );
      if (!chosen) return;
      loadCharacter(chosen.trim());
      return;
    }
    case "close":
    default:
      toggleSheetMenu(false);
      return;
  }
}

function bindAllSteppers() {
  $all(".num-wrap").forEach((wrap) => {
    if (wrap.dataset.bound) return;
    wrap.dataset.bound = "1";

    const input = $("input.be-num", wrap);
    const up = $('button[data-step="up"]', wrap);
    const down = $('button[data-step="down"]', wrap);

    if (input) {
      // keep it numeric, no decimals
      input.addEventListener("input", () => {
        const v = input.value;
        if (v === "") return;
        const n = Math.max(0, Math.floor(Number(v)));
        input.value = Number.isFinite(n) ? String(n) : "0";
      });
      input.addEventListener("blur", () => {
        if (input.value === "") input.value = "0";
      });
    }

    const step = (dir) => {
      if (!input) return;
      const cur = Number(input.value || "0");
      const next = dir === "up" ? cur + 1 : Math.max(0, cur - 1);
      input.value = String(next);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    if (up) up.addEventListener("click", () => step("up"));
    if (down) down.addEventListener("click", () => step("down"));
  });
}

// Basic armor state for sheet (placeholder values). Real values should be wired to saved characters.
const armorState = {
  head: { armorValue: '--', reduction: '--', durability: '--' },
  torso: { armorValue: '--', reduction: '--', durability: '--' },
  leftArm: { armorValue: '--', reduction: '--', durability: '--' },
  rightArm: { armorValue: '--', reduction: '--', durability: '--' },
  leftLeg: { armorValue: '--', reduction: '--', durability: '--' },
  rightLeg: { armorValue: '--', reduction: '--', durability: '--' }
};

function renderArmorPanel(){
  injectArmorStylesOnce();
  // populate armor stat placeholders
  Object.keys(armorState).forEach((slotKey) => {
    const slot = document.querySelector(`.armor-slot[data-slot="${slotKey}"]`);
    if (!slot) return;
    const row = slot.closest('.armor-row');
    if (!row) return;
    const av = row.querySelector('.stat-val.av');
    const ar = row.querySelector('.stat-val.ar');
    const dur = row.querySelector('.stat-val.dur');
    if (av) av.textContent = armorState[slotKey].armorValue;
    if (ar) ar.textContent = armorState[slotKey].reduction;
    if (dur) dur.textContent = armorState[slotKey].durability;
    // set accessible label
    slot.setAttribute('aria-label', `${slot.textContent}: AV ${armorState[slotKey].armorValue}, AR ${armorState[slotKey].reduction}, DUR ${armorState[slotKey].durability}`);
  });

  // create overlay inside the armor-list-col if missing
  const listCol = document.querySelector('.armor-list-col');
  if (listCol && !document.getElementById('armorOverlay')) {
    // ensure relative positioning for absolute overlay
    listCol.style.position = listCol.style.position || 'relative';

    const overlay = document.createElement('div');
    overlay.id = 'armorOverlay';
    overlay.className = 'armor-overlay be-hidden';
    overlay.innerHTML = `
      <div class="armor-overlay-inner">
        <div class="overlay-title" id="overlayTitle">SLOT</div>

        <div class="overlay-section" data-layer="base">
          <label class="overlay-label">BASE LAYER</label>
          <div class="overlay-select-wrap">
            <input class="overlay-input" data-layer="base" placeholder="Choose base..." autocomplete="off" />
            <div class="overlay-list be-hidden" data-layer="base"></div>
          </div>
          <div class="overlay-stats-row"><div class="overlay-stat">AV: <span class="ov-av">--</span></div><div class="overlay-stat">DR: <span class="ov-dr">--</span></div><div class="overlay-stat">DUR: <span class="ov-dur">--</span></div></div>
          <div class="overlay-stats-row"><div class="overlay-stat">RES: <span class="ov-res">--</span></div><div class="overlay-stat">WT: <span class="ov-wt">--</span></div></div>
        </div>

        <div class="overlay-section" data-layer="mid">
          <label class="overlay-label">MID LAYER</label>
          <div class="overlay-select-wrap">
            <input class="overlay-input" data-layer="mid" placeholder="Choose mid..." autocomplete="off" />
            <div class="overlay-list be-hidden" data-layer="mid"></div>
          </div>
          <div class="overlay-stats-row"><div class="overlay-stat">AV: <span class="ov-av">--</span></div><div class="overlay-stat">DR: <span class="ov-dr">--</span></div><div class="overlay-stat">DUR: <span class="ov-dur">--</span></div></div>
          <div class="overlay-stats-row"><div class="overlay-stat">RES: <span class="ov-res">--</span></div><div class="overlay-stat">WT: <span class="ov-wt">--</span></div></div>
        </div>

        <div class="overlay-section" data-layer="outer">
          <label class="overlay-label">OUTER LAYER</label>
          <div class="overlay-select-wrap">
            <input class="overlay-input" data-layer="outer" placeholder="Choose outer..." autocomplete="off" />
            <div class="overlay-list be-hidden" data-layer="outer"></div>
          </div>
          <div class="overlay-stats-row"><div class="overlay-stat">AV: <span class="ov-av">--</span></div><div class="overlay-stat">DR: <span class="ov-dr">--</span></div><div class="overlay-stat">DUR: <span class="ov-dur">--</span></div></div>
          <div class="overlay-stats-row"><div class="overlay-stat">RES: <span class="ov-res">--</span></div><div class="overlay-stat">WT: <span class="ov-wt">--</span></div></div>
        </div>

        <div class="overlay-actions"><button class="overlay-ok" id="overlayOk">OKAY</button><button class="overlay-cancel" id="overlayCancel">CANCEL</button></div>
      </div>
    `;

    listCol.appendChild(overlay);

    // wire custom input dropdowns: populate and filter
    overlay.querySelectorAll('.overlay-input').forEach(inp => {
      const layer = inp.dataset.layer;
      const list = overlay.querySelector(`.overlay-list[data-layer="${layer}"]`);
      // Make the input act like a dropdown trigger (readonly)
      inp.readOnly = true;
      inp.addEventListener('click', (e) => {
        console.log('[DEBUG] overlay-input click', { layer, slot: overlay.dataset.slot });
        // populate and show list
        populateOverlayOptions(overlay.dataset.slot || '', layer, overlay);
        // log list children after populate (may be empty)
        console.log('[DEBUG] overlay-list children after populate:', list ? list.children.length : 0);
        list.classList.remove('be-hidden');
        inp.focus();
      });
      // allow keyboard to open list
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          populateOverlayOptions(overlay.dataset.slot || '', layer, overlay);
          list.classList.remove('be-hidden');
          inp.focus();
          e.preventDefault();
        }
        if (e.key === 'Escape') {
          list.classList.add('be-hidden');
          inp.blur();
        }
      });
      // close list on outside click
      const closeHandler = (ev) => {
        if (!overlay.contains(ev.target)) {
          overlay.querySelectorAll('.overlay-list').forEach(l => l.classList.add('be-hidden'));
          return;
        }
        const inWrap = ev.target.closest('.overlay-select-wrap');
        if (!inWrap) overlay.querySelectorAll('.overlay-list').forEach(l => l.classList.add('be-hidden'));
      };
      document.addEventListener('click', closeHandler);
    });

    // wire actions
    overlay.querySelector('#overlayCancel').addEventListener('click', () => closeArmorOverlay());
    overlay.querySelector('#overlayOk').addEventListener('click', () => commitArmorOverlay());
  }

  // wire click to open overlay per slot
  document.querySelectorAll('.armor-slot').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => openArmorOverlay(btn.dataset.slot, btn.textContent.trim()));
  });
}

// Helper: get normalized slot label
function slotLabelForKey(key){
  const map = { head: 'head', torso: 'torso', leftArm: 'left arm', rightArm: 'right arm', leftLeg: 'left leg', rightLeg: 'right leg' };
  return map[key] || key;
}

async function openArmorOverlay(slotKey, titleText){
  // Ensure we have armor data before attempting to populate options
  await ensureDataLoaded();

  const overlay = document.getElementById('armorOverlay');
  if (!overlay) return;
  // change avatar image on the left to match the selected slot
  try {
    const avatar = document.querySelector('.armor-avatar-img');
    if (avatar) {
      // save original if not already saved
      if (!overlay.dataset.origAvatar) overlay.dataset.origAvatar = avatar.src || '';
      // compute filename token, convert camelCase / camel to UPPER-KEBAB
      const token = (slotKey || '').replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g,'-').toUpperCase();
      const imgName = `assets/armor-avatar-${token}.png`;
      avatar.src = imgName;
    }
  } catch (e) { /* ignore avatar swap errors */ }

  overlay.classList.remove('be-hidden');
  // Prefer CSS variable for panel alt background, fall back to computed armor-slot background or a safe color
  overlay.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bg-panel-alt') || getComputedStyle(document.querySelector('.armor-slot')).backgroundColor || '#2f7f8f';
  document.getElementById('overlayTitle').textContent = titleText || slotKey;
  overlay.dataset.slot = slotKey;

  // populate selects for each layer
  ['base','mid','outer'].forEach(layerName => {
    // For custom dropdowns we use the overlay-input element (not a <select>)
    const inp = overlay.querySelector(`.overlay-input[data-layer="${layerName}"]`);
    if (!inp) return;
    // clear existing options
    const list = overlay.querySelector(`.overlay-list[data-layer="${layerName}"]`);
    if (!list) return;
    list.innerHTML = '';
    const options = getArmorOptionsForLayer(slotKey, layerName);
    options.forEach(item => {
      const div = document.createElement('div');
      div.className = 'overlay-item';
      div.textContent = item.name;
      div.addEventListener('click', () => {
        inp.value = item.name;
        list.classList.add('be-hidden');
        populateOverlayStatsForLayer(overlay, layerName);
      });
      list.appendChild(div);
    });
    // prefill input if we have a saved choice
    const cur = (armorState[slotKey] && armorState[slotKey].layers && armorState[slotKey].layers[layerName]) || '';
    inp.value = cur || '';
    populateOverlayStatsForLayer(overlay, layerName);
  });
}

function closeArmorOverlay(){
  const overlay = document.getElementById('armorOverlay');
  if (!overlay) return;
  overlay.classList.add('be-hidden');
  overlay.dataset.slot = '';
  // restore original avatar src if we changed it
  try {
    const avatar = document.querySelector('.armor-avatar-img');
    if (avatar && overlay.dataset.origAvatar) {
      avatar.src = overlay.dataset.origAvatar;
      delete overlay.dataset.origAvatar;
    }
  } catch (e) {}
}

function getArmorOptionsForLayer(slotKey, layerName){
  // Return armorData items that specifically match the requested slot location and layer.
  // layerName comes from our UI ("base","mid","outer"). Match against item.layer.
  if (!Array.isArray(armorData)) return [];

  const wantedLayer = (layerName || '').toString().toLowerCase();

  // map UI layer keys to expected substrings in data.layer
  function layerMatches(itemLayer) {
    if (!itemLayer) return false;
    const l = normalize(itemLayer);
    if (wantedLayer === 'base') return l.includes('base');
    if (wantedLayer === 'mid') return l.includes('mid');
    if (wantedLayer === 'outer') return l.includes('outer') || l.includes('flexible') || l.includes('layer');
    return l.includes(wantedLayer);
  }

    // normalize location tokens (split comma-separated values)
    function locationMatches(itemLocation) {
      if (!itemLocation) return false;
      const parts = itemLocation.split(',').map(p => normalize(p.trim()));
      // desired slot tokens (normalize incoming slotKey to lower-case)
      const rawSlot = slotKey || '';
      const slotNorm = normalize(rawSlot);
      // map slot keys (lowercase) to location token substrings
      const slotToToken = {
        head: ['head'],
        torso: ['torso', 'chest', 'body'],
        leftarm: ['arms', 'arm'],
        rightarm: ['arms', 'arm'],
        leftleg: ['legs', 'leg'],
        rightleg: ['legs', 'leg']
      };
      const wantedTokens = slotToToken[slotNorm] || [slotNorm.replace(/[^a-z]/g,'')];
      return parts.some(p => wantedTokens.some(tok => p.includes(tok)));
    }

  // filter items where BOTH layer matches and location matches
  return armorData.filter(item => {
    const layerOk = layerMatches(item.layer);
    const locOk = locationMatches(item.location);
    return layerOk && locOk;
  }).sort((a,b) => (a.name || '').localeCompare(b.name || ''));
}

function populateOverlayStatsForLayer(overlay, layerName){
  // our custom dropdown stores the chosen value in the overlay-input
  const inp = overlay.querySelector(`.overlay-input[data-layer="${layerName}"]`);
  if (!inp) return;
  const selected = inp.value;
  const item = armorData.find(a => a.name === selected);
  const section = overlay.querySelector(`.overlay-section[data-layer="${layerName}"]`);
  if (!section) return;
  const av = section.querySelector('.ov-av');
  const dr = section.querySelector('.ov-dr');
  const dur = section.querySelector('.ov-dur');
  const res = section.querySelector('.ov-res');
  const wt = section.querySelector('.ov-wt');
  if (item) {
    av.textContent = item.armorValue != null ? String(item.armorValue) : '--';
    dr.textContent = item.reduction != null ? String(item.reduction) : '--';
    dur.textContent = item.durability != null ? String(item.durability) : '--';
  // show abbreviated resistance names to save space
  res.textContent = abbreviateResistance(item.resistance) || '--';
    wt.textContent = item.weight != null ? String(item.weight) : '--';
  } else {
    av.textContent = '--'; dr.textContent = '--'; dur.textContent = '--'; res.textContent = '--'; wt.textContent = '--';
  }
}

// Abbreviate common resistance names so they fit better in the overlay
function abbreviateResistance(raw){
  if (!raw) return '';
  if (Array.isArray(raw)) raw = raw.join(', ');
  const map = {
    'slashing': 'Slsh',
    'blunt': 'Blt',
    'piercing': 'Prc',
    'fire': 'Fir',
    'cold': 'Cld',
    'none': 'None'
  };
  return raw.split(/[,;]\s*/).map(token => {
    const k = token.trim().toLowerCase();
    return map[k] || token.trim().slice(0,6);
  }).join(', ');
}

// Populate custom dropdown list for a layer in the overlay
function populateOverlayOptions(slotKey, layerName, overlay){
  const list = overlay.querySelector(`.overlay-list[data-layer="${layerName}"]`);
  if (!list) return;
  console.log('[DEBUG] populateOverlayOptions', { slotKey, layerName });
  list.innerHTML = '';
  const options = getArmorOptionsForLayer(slotKey, layerName);
  console.log('[DEBUG] options length for', layerName, 'slot', slotKey, options.length, options.slice(0,6).map(o=>o.name));
  options.forEach(item => {
    const div = document.createElement('div');
    div.className = 'overlay-item';
    div.textContent = item.name;
    div.tabIndex = 0;
    div.addEventListener('click', () => {
      const inp = overlay.querySelector(`.overlay-input[data-layer="${layerName}"]`);
      inp.value = item.name;
      list.classList.add('be-hidden');
      populateOverlayStatsForLayer(overlay, layerName);
    });
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') div.click();
    });
    list.appendChild(div);
  });
}

function commitArmorOverlay(){
  const overlay = document.getElementById('armorOverlay');
  if (!overlay) return;
  const slotKey = overlay.dataset.slot;
  if (!slotKey) return closeArmorOverlay();

  const layers = {};
  ['base','mid','outer'].forEach(layerName => {
    const inp = overlay.querySelector(`.overlay-input[data-layer="${layerName}"]`);
    const val = inp ? inp.value : '';
    layers[layerName] = val || null;
  });

  // compute sums
  let avSum = 0, drSum = 0, durSum = 0, wtSum = 0; let resSet = new Set();
  ['base','mid','outer'].forEach(layerName => {
    const name = layers[layerName];
    if (!name) return;
    const item = armorData.find(a => a.name === name);
    if (!item) return;
    avSum += Number(item.armorValue) || 0;
    drSum += Number(item.reduction) || 0;
    durSum += Number(item.durability) || 0;
    wtSum += Number(item.weight) || 0;
    if (item.resistance) {
      (Array.isArray(item.resistance) ? item.resistance : String(item.resistance).split(/[,;]s*/)).forEach(r => resSet.add(r.trim()));
    }
  });

  armorState[slotKey] = armorState[slotKey] || {};
  armorState[slotKey].layers = layers;
  armorState[slotKey].armorValue = avSum || '--';
  armorState[slotKey].reduction = drSum || '--';
  armorState[slotKey].durability = durSum || '--';
  armorState[slotKey].weight = wtSum || '--';
  armorState[slotKey].resistance = Array.from(resSet).join(', ') || '--';

  renderArmorPanel();
  // persist armor changes into the active saved character (if any)
  persistActiveCharacterState();
  closeArmorOverlay();
}

/* ===================================================
   5) COMPENDIUM (YOUR EXISTING CODE, WRAPPED)
=================================================== */

let compendiumInitialized = false;

let currentPage = "echoes";
let currentSearch = "";
let currentFilter = null;

const pagesConfig = {
  echoes: {
    label: "Echoes",
    data: () => echoesData,
    filterLabel: "Type",
    chipOptions: ["All"]
  },
  weapons: {
    label: "Weapons",
    data: () => weaponsData,
    filterLabel: "Category",
    chipOptions: ["All", "Melee", "Ranged", "Thrown"]
  },
  skills: {
    label: "Advanced Skills",
    data: () => advancedSkillsData,
    filterLabel: "Category",
    chipOptions: ["All"]
  },
  armor: {
    label: "Armor",
    data: () => armorData,
    filterLabel: "Class",
    chipOptions: ["All", "Light", "Medium", "Heavy", "Soft layer", "Flexible mid layer"]
  },
  conditions: {
    label: "Conditions",
    data: () => conditionsData,
    filterLabel: "Severity",
    chipOptions: ["All"]
  }
};

function passesFilter(item) {
  if (!currentFilter || currentFilter === "All") return true;

  switch (currentPage) {
    case "weapons":
      return normalize(item.category) === normalize(currentFilter);
    case "armor":
      // filter armor by its "layer" property (e.g. Head, Body, etc.)
      return normalize(item.layer || item.location || item.armorClass) === normalize(currentFilter);
    default:
      return true;
  }
}

function passesSearch(item) {
  const q = normalize(currentSearch);
  if (!q) return true;

  const haystack = [
    item.name,
    item.type,
    item.category,
    item.summary,
    item.description,
    item.effect,
    item.resistance,
    item.armorClass,
    (item.tags || []).join(" "),
    (item.layers || []).join(" "),
    item.layer
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

function renderChips() {
  const chipRow = $("#chipRow");
  if (!chipRow) return;
  chipRow.innerHTML = "";
  const config = pagesConfig[currentPage];
  if (!config || !config.chipOptions) return;

  // If we're on the armor page, derive chip options from available 'layer' values
  let chipOptions = config.chipOptions;
  if (currentPage === "armor") {
    const data = (config.data && config.data()) || [];
    const layers = new Set();
    data.forEach((it) => {
      if (it.layer) layers.add(it.layer);
      else if (it.layers && Array.isArray(it.layers)) it.layers.forEach((l) => layers.add(l));
    });
    chipOptions = ["All", ...Array.from(layers).sort()];
  }

  chipOptions.forEach((label) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (label === "All" && !currentFilter ? " active" : "");
    btn.textContent = label;
    btn.dataset.value = label;
    chipRow.appendChild(btn);
  });
}

function renderList() {
  const listContainer = $("#listContainer");
  const emptyMessage = $("#emptyMessage");
  if (!listContainer || !emptyMessage) return;

  listContainer.innerHTML = "";

  const config = pagesConfig[currentPage];
  const data = config ? config.data() : [];

  const filtered = data.filter((item) => passesFilter(item) && passesSearch(item));

  if (!filtered.length) {
    emptyMessage.style.display = "block";
    return;
  } else {
    emptyMessage.style.display = "none";
  }

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "item-card";
    card.dataset.id = item.name;
    card.dataset.page = currentPage;

    const main = document.createElement("div");
    main.className = "item-main";

    const title = document.createElement("div");
    title.className = "item-title";

    // For armor, include location in the title (e.g. "Padded Coif - Head")
    let displayName = item.name || "";
    if (currentPage === "weapons" && item.type) {
      displayName = `${item.name} - ${item.type}`;
    }
    if (currentPage === "armor") {
      const loc = item.location || item.layer || item.armorClass || null;
      if (loc) displayName = `${displayName} - ${loc}`;
    }
    title.textContent = displayName;

    const meta = document.createElement("div");
    meta.className = "item-meta";

    if (currentPage === "echoes") {
      meta.textContent =
        "Echo" +
        " · Ephem " +
        (item.ephemCost != null ? item.ephemCost : "?") +
        (item.range ? " · Range " + item.range : "");
    } else if (currentPage === "weapons") {
      const stats = [];

      if (item.diePool && item.dieSize) stats.push(`${item.diePool}${item.dieSize}`);
      else if (item.diePool) stats.push(String(item.diePool));

      if (item.damage != null) stats.push(`Damage ${item.damage}`);
      if (item.penetration != null) stats.push(`Pen ${item.penetration}`);
      if (item.range) stats.push(`Range ${item.range}`);

      meta.textContent = stats.join(" · ");
    } else if (currentPage === "skills") {
      meta.textContent = "Advanced Skill" + (item.cost ? " · Cost " + item.cost : "");
    } else if (currentPage === "armor") {
      // Abbreviated stat line: AV, AR, DUR
      const parts = [];
      if (item.armorValue != null) parts.push(`AV: ${item.armorValue}`);
      if (item.reduction != null) parts.push(`AR: ${item.reduction}`);
      if (item.durability != null) parts.push(`DUR: ${item.durability}`);
      meta.textContent = parts.join(" · ");
    } else if (currentPage === "conditions") {
      meta.textContent = "Condition";
    }

    const tagline = document.createElement("div");
    tagline.className = "item-tagline";
    if (currentPage === "armor") {
      const extras = [];
      if (item.resistance) extras.push(`RES: ${item.resistance}`);
      if (item.weight != null) extras.push(`WT: ${item.weight}`);
      tagline.textContent = extras.join(" · ");
    } else {
      tagline.textContent = item.summary || item.description || item.effect || "";
    }

    main.appendChild(title);
    main.appendChild(meta);
    if (tagline.textContent) main.appendChild(tagline);

    const pill = document.createElement("div");
    pill.className = "item-pill";

    if (currentPage === "echoes") pill.textContent = "Echo";
    else if (currentPage === "weapons") pill.textContent = item.category || "Weapon";
    else if (currentPage === "skills") pill.textContent = "Skill";
  else if (currentPage === "armor") pill.textContent = item.layer || item.armorClass || "Armor";
    else pill.textContent = "Condition";

    card.appendChild(main);
    card.appendChild(pill);
    listContainer.appendChild(card);
  });
}

/* Modal */
let modalBackdrop, modalTitle, modalSubtitle, modalPills, modalBody, modalClose;

function initModalRefs() {
  modalBackdrop = $("#modalBackdrop");
  modalTitle = $("#modalTitle");
  modalSubtitle = $("#modalSubtitle");
  modalPills = $("#modalPills");
  modalBody = $("#modalBody");
  modalClose = $("#modalClose");
}

function makePill(text) {
  const pill = document.createElement("span");
  pill.className = "modal-pill";
  pill.textContent = text;
  return pill;
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("show");
}

function openModal(item, page) {
  if (!item || !modalBackdrop) return;

  modalTitle.textContent = item.name || "";

  if (page === "echoes") modalSubtitle.textContent = "Echo";
  else if (page === "weapons")
    modalSubtitle.textContent = (item.category || "Weapon") + (item.type ? " · " + item.type : "");
  else if (page === "skills") modalSubtitle.textContent = "Advanced Skill";
  else if (page === "armor")
    modalSubtitle.textContent = "Armor" + (item.armorClass ? " · " + item.armorClass : "");
  else modalSubtitle.textContent = "Condition";

  modalPills.innerHTML = "";

  if (page === "echoes") {
    if (item.ephemCost != null) modalPills.appendChild(makePill("Ephem: " + item.ephemCost));
    if (item.damage) modalPills.appendChild(makePill("Damage: " + item.damage));
    if (item.range) modalPills.appendChild(makePill("Range: " + item.range));
  } else if (page === "weapons") {
    if (item.diePool != null) {
      modalPills.appendChild(makePill("Dice Pool: " + item.diePool + (item.dieSize ? item.dieSize : "")));
    }
    if (item.damage != null) modalPills.appendChild(makePill("Damage: " + item.damage));
    if (item.penetration != null) modalPills.appendChild(makePill("Pen: " + item.penetration));
    if (item.range) modalPills.appendChild(makePill("Range: " + item.range));
    if (item.description) modalPills.appendChild(makePill(item.description));
  } else if (page === "skills") {
    if (item.cost) modalPills.appendChild(makePill("Cost: " + item.cost));
    if (item.requirement) modalPills.appendChild(makePill("Req: " + item.requirement));
  } else if (page === "armor") {
    if (item.armorValue != null) modalPills.appendChild(makePill("Armor Value: " + item.armorValue));
    if (item.reduction != null) modalPills.appendChild(makePill("Reduction: " + item.reduction));
    if (item.resistance) modalPills.appendChild(makePill("Resist: " + item.resistance));
    if (item.location) modalPills.appendChild(makePill("Location: " + item.location));
    if (item.layer) modalPills.appendChild(makePill("Layer: " + item.layer));
  }

  const bodyParts = [];
  if (item.summary || item.description || item.effect) {
    bodyParts.push(`<p><strong>${item.summary || item.description || item.effect}</strong></p>`);
  }

  if (page === "echoes") {
    const upgrades = [item.tier2, item.tier3].filter(Boolean);
    if (upgrades.length) {
      bodyParts.push(`<div class="modal-section-title">Tier Upgrades</div><ul>`);
      upgrades.forEach((u) => bodyParts.push(`<li>${u}</li>`));
      bodyParts.push(`</ul>`);
    }
  }

  if (page === "skills" && item.effect) {
    bodyParts.push(`<div class="modal-section-title">Effect</div><p>${item.effect}</p>`);
  }

  if (page === "weapons" && item.rangeBands) {
    bodyParts.push(`<div class="modal-section-title">Range Bands</div><ul>`);
    const rb = item.rangeBands;
    if (rb.close) bodyParts.push(`<li>Close: ${rb.close}</li>`);
    if (rb.effective) bodyParts.push(`<li>Effective: ${rb.effective}</li>`);
    if (rb.far) bodyParts.push(`<li>Far: ${rb.far}</li>`);
    if (rb.max) bodyParts.push(`<li>Max: ${rb.max}</li>`);
    bodyParts.push(`</ul>`);
  }

  if (page === "armor") {
    const lines = [];
    if (item.armorValue != null) lines.push(`Armor Value: ${item.armorValue}`);
    if (item.reduction != null) lines.push(`Reduction: ${item.reduction}`);
    if (item.durability != null) lines.push(`Durability: ${item.durability}`);
    if (item.resistance) lines.push(`Resistance: ${item.resistance}`);
    if (item.weight != null) lines.push(`Weight: ${item.weight}`);
    if (item.cost != null) lines.push(`Cost: ${item.cost}`);
    if (item.notes) lines.push(item.notes);
    if (lines.length) {
      bodyParts.push(`<div class="modal-section-title">Details</div><ul>`);
      lines.forEach((l) => bodyParts.push(`<li>${l}</li>`));
      bodyParts.push(`</ul>`);
    }
  }

  modalBody.innerHTML = bodyParts.join("");
  modalBackdrop.classList.add("show");
}

async function initCompendiumOnce() {
  if (compendiumInitialized) return;
  compendiumInitialized = true;

  // Ensure data files are loaded before wiring UI
  await ensureDataLoaded();

  // Wire compendium events (only if the elements exist)
  initModalRefs();

  const topNav = $("#topNav");
  const chipRow = $("#chipRow");
  const searchInput = $("#searchInput");
  const listContainer = $("#listContainer");

  if (!topNav || !chipRow || !searchInput || !listContainer) {
    console.warn("Compendium UI elements not found. If you changed index.html structure, tell me.");
    return;
  }

  // Wire compendium header logo to navigate home
  const compendiumLogo = $("#compendiumLogo");
  if (compendiumLogo && !compendiumLogo.dataset.bound) {
    compendiumLogo.dataset.bound = "1";
    compendiumLogo.addEventListener("click", () => navigate("home"));
  }

  // Top nav
  topNav.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const btn = e.target.closest("button[data-page]");
    if (!btn) return;
    const page = btn.dataset.page;
    if (!page || page === currentPage) return;

    currentPage = page;
    currentFilter = null;
    currentSearch = "";
    searchInput.value = "";

    $all("#topNav button").forEach((b) =>
      b.classList.toggle("active", b.dataset.page === currentPage)
    );

    renderChips();
    renderList();
  });

  // Chips
  chipRow.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const val = chip.dataset.value;
    currentFilter = val === "All" ? null : val;

    $all(".chip").forEach((c) => c.classList.toggle("active", c === chip));
    renderList();
  });

  // Search
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderList();
  });

  // Click item -> open modal
  listContainer.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const card = e.target.closest(".item-card");
    if (!card) return;

    const key = card.dataset.id;
    const page = card.dataset.page;
    const config = pagesConfig[page];
    if (!config) return;

    const item = config.data().find((x) => x.name === key);
    openModal(item, page);
  });

  // Modal close
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      toggleSheetMenu(false);
    }
  });

  // Initial render
  renderChips();
  renderList();
}

/* ===================================================
   6) STARTUP + HASH ROUTING
=================================================== */

function viewFromHash() {
  const h = (location.hash || "").toLowerCase();
  if (h.includes("sheet")) return "sheet";
  if (h.includes("compendium")) return "compendium";
  return "home";
}

window.addEventListener("hashchange", () => {
  showOnly(viewFromHash());
});

document.addEventListener("DOMContentLoaded", () => {
  ensureScreens();
  showOnly(viewFromHash());
});

/* ===================================================
   7) (Optional) Hook your existing SW registration stays in index.html
=================================================== */

/* ===================================================
   8) PORTRAIT LOCK (Attempt via Screen Orientation API + fallback overlay)
   - Tries to lock orientation to portrait for installed PWAs/browsers that allow it.
   - If lock isn't available, shows an overlay when device is landscape telling users
     to rotate back to portrait. The overlay prevents interaction with the app.
   - Works on modern mobile browsers (Chrome/Android, Safari/iOS Progressive Web App
     contexts may not allow programmatic lock). The manifest also requests "portrait".
==================================================== */

function createPortraitOverlayOnce(){
  if (document.getElementById('be-portrait-overlay')) return;
  const div = document.createElement('div');
  div.id = 'be-portrait-overlay';
  div.innerHTML = `<div class="inner"><h2>Please rotate your device</h2><p>This app is designed for portrait mode only. Rotate your device back to portrait to continue.</p></div>`;
  document.body.appendChild(div);
}

async function tryLockPortrait() {
  // If the browser supports the Screen Orientation API, try to lock to portrait-primary
  // Note: lock() returns a promise and will reject if not allowed (e.g. not in fullscreen or not installed PWA)
  if (screen && screen.orientation && typeof screen.orientation.lock === 'function') {
    try {
      await screen.orientation.lock('portrait');
      // If successful, ensure overlay is hidden
      document.body.classList.remove('be-portrait-locked');
      const ov = document.getElementById('be-portrait-overlay');
      if (ov) ov.classList.remove('show');
      return true;
    } catch (e) {
      // Lock not allowed (common on iOS Safari and non-installed contexts)
      return false;
    }
  }
  return false;
}

function onOrientationChangeFallback(){
  // Called when we couldn't programmatically lock orientation. Show overlay when landscape.
  createPortraitOverlayOnce();
  const isLandscape = window.matchMedia && window.matchMedia('(orientation: landscape)').matches;
  const overlay = document.getElementById('be-portrait-overlay');
  if (isLandscape) {
    document.body.classList.add('be-portrait-locked');
    if (overlay) overlay.classList.add('show');
  } else {
    document.body.classList.remove('be-portrait-locked');
    if (overlay) overlay.classList.remove('show');
  }
}

// Initialize portrait lock attempt on load, and wire orientationchange/resize as fallback
window.addEventListener('load', async () => {
  // Add manifest orientation (already set) and attempt lock
  const locked = await tryLockPortrait();
  if (!locked) {
    // Use fallback overlay strategy
    onOrientationChangeFallback();
    // Listen for changes
    window.addEventListener('orientationchange', onOrientationChangeFallback);
    window.addEventListener('resize', onOrientationChangeFallback);
    // Also listen for page visibility in case PWA install context changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) onOrientationChangeFallback();
    });
  }
});

