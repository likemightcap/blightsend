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
      filter: drop-shadow(0 10px 22px rgba(0,0,0,0.65));
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
      filter: drop-shadow(0 10px 18px rgba(0,0,0,0.65));
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
      grid-template-columns: repeat(2, 1fr);
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
    .stepper button{
      flex: 1;
      border: 0;
      background: rgba(255,255,255,0.06);
      color: var(--text-main);
      cursor:pointer;
      font-size: 0.95rem;
      line-height: 1;
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

    /* Tiny: stack top grid if narrow */
    @media (max-width: 420px){
      .sheet-grid-top{ grid-template-columns: 1fr; }
      .sheet-row{ grid-template-columns: repeat(2, 1fr); }
      .stat-strip{ grid-template-columns: repeat(2, 1fr); }
      .sheet-buttons{ grid-template-columns: 1fr; }
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

// Additional armor panel styles appended to the same injected style block
function injectArmorStylesOnce(){
  if ($('#_beArmorStyles')) return;
  const s = document.createElement('style');
  s.id = '_beArmorStyles';
  s.textContent = `
  .sheet-armor-panel{ max-width:900px; margin: 1rem auto; padding: 1rem 1.25rem; background: #4f5754; border-radius: 12px; }
    /* Make the avatar column larger so the avatar is more prominent */
    .armor-grid{ display:flex; gap: 0.85rem; align-items:center; }
  /* left: large avatar area; right: stacked pills column */
  .armor-avatar-col{ flex: 0 0 58%; display:flex; align-items:center; justify-content:center; }
  .armor-list-col{ flex: 0 0 38%; max-width: 38%; min-width:220px; display:flex; flex-direction:column; gap:0.9rem; }
    .armor-avatar-img{ max-width: 100%; height:auto; display:block; filter: drop-shadow(0 14px 28px rgba(0,0,0,0.75)); }
    .armor-row{ display:flex; flex-direction:column; gap:6px; align-items:stretch; }
    /* Pill should span almost full column; stats are shown below */
    .armor-slot{ background:#2f7f8f; color:#fff; border:0; padding:10px 14px; border-radius:14px; font-weight:800; letter-spacing:0.08em; cursor:pointer; width:100%; text-align:center; font-size:0.98rem; text-transform:uppercase; }
    .armor-slot.full{ width:100%; }
    .armor-stats{ font-size:0.9rem; color:#e6e6e6; display:flex; gap:18px; justify-content:center; padding-left:6px; white-space:nowrap; overflow:visible; align-items:center; margin-top:6px; }
    /* label is muted, value is highlighted yellow and sits close to label */
    .armor-stats .stat-label{ color:#e6e6e6; font-weight:700; margin-right:6px; }
    .armor-stats .stat-val{ color:#f6c44d; font-weight:900; min-width:20px; display:inline-block; text-align:left; }
    /* Ensure stats stay on one line on narrow screens; reduce font-size slightly if needed */
    @media (max-width:520px){
      .armor-grid{ flex-direction:row; }
      .armor-avatar-col{ flex:0 0 50%; }
      .armor-list-col{ flex:1 1 50%; }
      .armor-stats{ font-size:0.82rem; gap:8px; }
      .sheet-buttons{ grid-template-columns: 1fr; }
    }
  /* Armor overlay (fills right column area) */
  .armor-overlay{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:40; }
  .armor-overlay.be-hidden{ display:none; }
  .armor-overlay-inner{ width:100%; height:100%; background: #2f7f8f; padding:14px; box-sizing:border-box; color:#fff; border-radius:8px; display:flex; flex-direction:column; gap:10px; font-size:0.94rem; overflow: visible; }
  .overlay-title{ font-weight:900; font-size:1.0rem; text-align:center; margin-bottom:4px; }
  .overlay-section{ background: transparent; padding:0; border-radius:6px; display:flex; flex-direction:column; gap:8px; }
  .overlay-label{ font-weight:900; color:#e6e6e6; font-size:0.78rem; letter-spacing:0.08em; }
  .overlay-select{ width:100%; padding:6px; border-radius:4px; border:0; background:#fff; color:#1a1a1a; font-size:0.95rem; }
  .overlay-select-wrap{ position:relative; }
  .overlay-input{ width:100%; padding:10px 12px; border-radius:4px; border:0; background:#fff; color:#111; font-size:0.95rem; font-weight:700; }
  .overlay-list{ position:absolute; left:0; right:0; top:40px; max-height:160px; overflow:auto; background:#fff; color:#111; border-radius:6px; box-shadow:0 8px 20px rgba(0,0,0,0.6); z-index:9999; }
  .overlay-item{ padding:8px 10px; cursor:pointer; border-bottom:1px solid rgba(0,0,0,0.06); }
  .overlay-item:hover, .overlay-item.hover{ background:rgba(0,0,0,0.06); }
  .overlay-stats-row{ display:flex; gap:12px; justify-content:flex-start; align-items:center; font-weight:700; font-size:0.92rem; }
  .overlay-stat{ color:#e6e6e6; }
  .overlay-stat .ov-av, .overlay-stat .ov-dr, .overlay-stat .ov-dur, .overlay-stat .ov-res, .overlay-stat .ov-wt{ color:#f6c44d; font-weight:900; }
  .overlay-actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:auto; }
  .overlay-ok, .overlay-cancel{ padding:6px 10px; border-radius:6px; border:0; cursor:pointer; font-weight:800; font-size:0.88rem; }
  .overlay-ok{ background:#111; color:#fff; border-radius:8px; padding:8px 12px; }
  .overlay-cancel{ background:#222; color:#fff; border-radius:8px; padding:8px 12px; }
  `;
  document.head.appendChild(s);
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
            ${numField("cs_hp")}
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

        <!-- Armor panel mockup (moved inside sheet-card, above the section buttons) -->
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

        <div class="sheet-buttons">
          <button class="sheet-action" type="button" id="cs_btn_backpack">Backpack</button>
          <button class="sheet-action" type="button" id="cs_btn_armor">Armor</button>
          <button class="sheet-action" type="button" id="cs_btn_gear">Gear</button>
          <button class="sheet-action" type="button" id="cs_btn_echoes">Echoes</button>
        </div>
      </section>

      

      <div id="sheetMenuOverlay" aria-hidden="true">
        <div class="sheet-menu-modal" role="dialog" aria-modal="true" aria-label="Character Sheet Menu">
          <div class="sheet-menu-title">Menu</div>
          <div class="sheet-menu-list">
            <button class="sheet-menu-item" type="button" data-action="home">Home</button>
            <button class="sheet-menu-item" type="button" data-action="save">Save Character</button>
            <button class="sheet-menu-item" type="button" data-action="load">Load Character</button>
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
    stamina: getNum("cs_stamina"),
    ephem: getNum("cs_ephem"),
    walk: getNum("cs_walk"),
    run: getNum("cs_run"),
    fight: getNum("cs_fight"),
    volley: getNum("cs_volley"),
    guts: getNum("cs_guts"),
    grit: getNum("cs_grit"),
    focus: getNum("cs_focus"),
    updatedAt: Date.now()
  };
}

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
  setNum("cs_stamina", state.stamina);
  setNum("cs_ephem", state.ephem);
  setNum("cs_walk", state.walk);
  setNum("cs_run", state.run);
  setNum("cs_fight", state.fight);
  setNum("cs_volley", state.volley);
  setNum("cs_guts", state.guts);
  setNum("cs_grit", state.grit);
  setNum("cs_focus", state.focus);
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
  overlay.classList.remove('be-hidden');
  overlay.style.background = getComputedStyle(document.querySelector('.armor-slot')).backgroundColor || '#2f7f8f';
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
    // desired slot tokens
    const slot = slotKey || '';
    const target = slot.toLowerCase();
    // map slot keys to location token substrings
    const slotToToken = {
      head: ['head'],
      torso: ['torso', 'chest', 'body'],
      leftarm: ['arms', 'arm'],
      rightarm: ['arms', 'arm'],
      leftleg: ['legs', 'leg'],
      rightleg: ['legs', 'leg'],
      leftArm: ['arms', 'arm'],
      rightArm: ['arms', 'arm']
    };
    const wantedTokens = slotToToken[slot] || [slot.replace(/[^a-z]/g,'')];
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
    // show full resistance names, but keep them compact via CSS/abbrev map if needed
    res.textContent = item.resistance || '--';
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
