/* ---------------------------------------------------
   DATA
   (These are EXAMPLES – expand/replace with full lists)
----------------------------------------------------*/

const echoes = [
  {
    id: "force-dart",
    name: "Force Dart",
    type: "Attack",
    tier: 1,
    ephemCost: "2 (1 per bolt)",
    damage: "1 per bolt",
    range: '12"',
    tags: ["Direct", "Multi-Target"],
    summary:
      "Fire bolts of arcane force that automatically hit targets in range and line of sight.",
    rules: [
      "As an action, you fire 2 bolts of magical energy from your hands that always hit as long as the target is within range and line of sight.",
      "You may split the bolts between multiple targets or direct them all at one target.",
      "You may spend additional action points to fire more bolts, 1 AP for 1 additional bolt."
    ],
    tierUpgrades: [
      "+1 Ephem: Each Force Dart deals 2 damage instead of 1.",
      "+2 Ephem: Each Force Dart deals 3 damage instead of 1."
    ]
  },
  {
    id: "acid-bath",
    name: "Acid Bath",
    type: "Area",
    tier: 1,
    ephemCost: "2",
    damage: "3",
    range: "Throw",
    tags: ["AOE", "Hazard", "Corrosive"],
    summary:
      "Hurl a ball of acid that burns everything in a small area and leaves a lingering hazard.",
    rules: [
      "Make a Throw action and place a 3\" AOE template centered where the throw lands.",
      "All creatures under the template take 3 damage and suffer the Corrosive effect.",
      "The AOE remains in play for 3 turns. Any model that enters the AOE suffers the Corrosive effect.",
      "Starting on the player's next Upkeep Phase, any model suffering from Corrosive permanently reduces its Armor Class and Damage by 1. Corrosive lasts for 2 rounds."
    ],
    tierUpgrades: [
      "+2 Ephem: Increase the AOE template to 4\". Models suffering Corrosive reduce Armor Class and Damage by 2 instead."
    ]
  },
  // Add the rest of your Echoes here in the same structure
];

const weapons = [
  {
    id: "longsword",
    name: "Longsword",
    category: "Melee",
    type: "Slashing",
    dicePool: "2d6",
    damage: "2",
    penetration: "2",
    reach: '1"',
    tags: ["Versatile", "Reliable"],
    summary: "A balanced blade favored by trained Enders.",
    rules: [
      "Standard melee weapon used in close combat.",
      "Can be used with many advanced skills that require a Slashing weapon."
    ]
  },
  {
    id: "warhammer",
    name: "Warhammer",
    category: "Melee",
    type: "Blunt",
    dicePool: "2d6",
    damage: "3",
    penetration: "3",
    reach: '1"',
    tags: ["Armorbreaker"],
    summary: "A brutal hammer designed to crush armor and bone.",
    rules: [
      "On a Direct Hit against armored targets, narrate or note visible dents, cracks, or buckled plates."
    ]
  },
  {
    id: "hunting-bow",
    name: "Hunting Bow",
    category: "Ranged",
    type: "Piercing",
    dicePool: "2d6",
    damage: "2",
    penetration: "1",
    reach: '18"',
    tags: ["Ranged", "Silent"],
    summary: "A reliable bow for ranged engagements.",
    rules: [
      "Requires clear line of sight to the target.",
      "Affected by cover, elevation, and visibility as normal."
    ]
  },
  // Add full melee/ranged table here
];

const skills = [
  {
    id: "circle-of-iron",
    name: "Circle of Iron",
    category: "Combat",
    cost: "2 AP + 2 Stamina",
    requirement:
      "Two-handed Slashing, Blunt, or Cleave weapon (not usable with Piercing weapons).",
    summary:
      "Turn your weapon into a full-circle crash of force, striking any foes in reach.",
    rules: [
      "Make a Fight action.",
      "Roll a number of melee attack dice equal to your weapon's normal dice pool plus the number of enemies within your melee range (360°).",
      "Assign hits to any enemies within range regardless of facing."
    ],
    flavor:
      "Momentum, weight, and will turn your weapon into a full-circle crash of force."
  },
  {
    id: "fleet-footed",
    name: "Fleet-Footed",
    category: "Movement",
    cost: "Passive",
    requirement: "Ender, Walk 4\"+",
    summary: "Your training pushes your movement beyond normal limits.",
    rules: [
      "Increase your Walk distance by +1\".",
      "Increase your Run distance by +1\"."
    ],
    flavor:
      "Your stride becomes practiced and relentless, carrying you farther with every step."
  },
  // Add more advanced skills here
];

const armorPieces = [
  {
    id: "padded-jacket",
    name: "Padded Jacket",
    class: "Light",
    layers: ["Soft"],
    armorValue: 2,
    location: "Torso",
    summary: "Quilted cloth armor that blunts blows without restricting movement.",
    rules: [
      "Counts as Light Armor.",
      "While worn, increase Walk and Run distances by +1\" (Light Armor bonus)."
    ]
  },
  {
    id: "chain-shirt",
    name: "Chain Shirt",
    class: "Medium",
    layers: ["Soft", "Flexible"],
    armorValue: 4,
    location: "Torso",
    summary:
      "A mesh of interlocking rings layered over padding to absorb and spread impact.",
    rules: [
      "Counts as Medium Armor.",
      "No movement adjustment from armor (baseline)."
    ]
  },
  {
    id: "plate-mail",
    name: "Plate Mail",
    class: "Heavy",
    layers: ["Soft", "Flexible", "Hard"],
    armorValue: 6,
    location: "Torso",
    summary:
      "Layered steel plates bolted over chain and padding, turning you into a walking bulwark.",
    rules: [
      "Counts as Heavy Armor.",
      "While worn, reduce Walk and Run distances by 1\"."
    ]
  },
  // Add full armor catalog here
];

const conditions = [
  {
    id: "burning",
    name: "Burning",
    severity: "Ongoing",
    summary: "You are engulfed by unnatural flame.",
    rules: [
      "At the start of each of your turns, you take 2 damage.",
      "Lasts for 2 rounds, ending at the beginning of the player's turn when it expires.",
      "Some effects or terrain can extend or intensify Burning."
    ]
  },
  {
    id: "corrosive",
    name: "Corrosive",
    severity: "Ongoing",
    summary: "Your armor and weapons are eaten away by acid.",
    rules: [
      "While affected, your Armor Class and Damage are reduced by 1.",
      "Starting on the affected model's next Upkeep Phase, the reduction is permanent unless otherwise noted by the Echo or effect.",
      "Corrosive typically lasts for 2 rounds."
    ]
  },
  // Add other key conditions (Stunned, Prone, Bleeding, etc.)
];

/* ---------------------------------------------------
   STATE
----------------------------------------------------*/

let currentPage = "echoes";
let currentSearch = "";
let currentFilter = null; // like "Attack" for Echo types, etc.

const pagesConfig = {
  echoes: {
    label: "Echoes",
    data: () => echoes,
    filterLabel: "Type",
    chipOptions: ["All", "Attack", "Area", "Utility"]
  },
  weapons: {
    label: "Weapons",
    data: () => weapons,
    filterLabel: "Category",
    chipOptions: ["All", "Melee", "Ranged"]
  },
  skills: {
    label: "Advanced Skills",
    data: () => skills,
    filterLabel: "Category",
    chipOptions: ["All", "Combat", "Movement", "Utility"]
  },
  armor: {
    label: "Armor",
    data: () => armorPieces,
    filterLabel: "Class",
    chipOptions: ["All", "Light", "Medium", "Heavy"]
  },
  conditions: {
    label: "Conditions",
    data: () => conditions,
    filterLabel: "Severity",
    chipOptions: ["All", "Ongoing", "Instant", "Lasting"]
  }
};

/* ---------------------------------------------------
   RENDER HELPERS
----------------------------------------------------*/

function normalize(str) {
  return (str || "").toString().toLowerCase();
}

function passesFilter(item) {
  if (!currentFilter || currentFilter === "All") return true;
  switch (currentPage) {
    case "echoes":
      return normalize(item.type) === normalize(currentFilter);
    case "weapons":
      return normalize(item.category) === normalize(currentFilter);
    case "skills":
      return normalize(item.category) === normalize(currentFilter);
    case "armor":
      return normalize(item.class) === normalize(currentFilter);
    case "conditions":
      return normalize(item.severity) === normalize(currentFilter);
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
    (item.tags || []).join(" "),
    (item.layers || []).join(" ")
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function renderChips() {
  const chipRow = document.getElementById("chipRow");
  chipRow.innerHTML = "";
  const config = pagesConfig[currentPage];
  if (!config || !config.chipOptions) return;

  config.chipOptions.forEach((label) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (label === "All" && !currentFilter ? " active" : "");
    btn.textContent = label;
    btn.dataset.value = label;
    chipRow.appendChild(btn);
  });
}

function renderList() {
  const listContainer = document.getElementById("listContainer");
  const emptyMessage = document.getElementById("emptyMessage");
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
    card.dataset.id = item.id;
    card.dataset.page = currentPage;

    const main = document.createElement("div");
    main.className = "item-main";

    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "item-meta";

    if (currentPage === "echoes") {
      meta.textContent =
        (item.type || "Echo") +
        " · Ephem " +
        (item.ephemCost || "?") +
        (item.range ? " · Range " + item.range : "");
    } else if (currentPage === "weapons") {
      meta.textContent =
        (item.category || "Weapon") +
        " · " +
        (item.type || "") +
        (item.dicePool ? " · " + item.dicePool : "") +
        (item.penetration ? " · Pen " + item.penetration : "");
    } else if (currentPage === "skills") {
      meta.textContent =
        (item.category || "Skill") +
        (item.cost ? " · Cost " + item.cost : "");
    } else if (currentPage === "armor") {
      meta.textContent =
        (item.class || "Armor") +
        (item.location ? " · " + item.location : "") +
        (item.armorValue != null ? " · AV " + item.armorValue : "");
    } else if (currentPage === "conditions") {
      meta.textContent =
        (item.severity || "Condition") +
        (item.duration ? " · " + item.duration : "");
    }

    const tagline = document.createElement("div");
    tagline.className = "item-tagline";
    tagline.textContent = item.summary || "";

    main.appendChild(title);
    main.appendChild(meta);
    if (item.summary) main.appendChild(tagline);

    const pill = document.createElement("div");
    pill.className = "item-pill";

    if (currentPage === "echoes") {
      pill.textContent = "Tier " + (item.tier || 1);
    } else if (currentPage === "weapons") {
      pill.textContent = item.category || "Weapon";
    } else if (currentPage === "skills") {
      pill.textContent = item.category || "Skill";
    } else if (currentPage === "armor") {
      pill.textContent = item.class || "Armor";
    } else if (currentPage === "conditions") {
      pill.textContent = item.severity || "Condition";
    }

    card.appendChild(main);
    card.appendChild(pill);
    listContainer.appendChild(card);
  });
}

/* ---------------------------------------------------
   MODAL
----------------------------------------------------*/

const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalPills = document.getElementById("modalPills");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function openModal(item, page) {
  if (!item) return;

  modalTitle.textContent = item.name || "";

  // Subtitle by page
  if (page === "echoes") {
    modalSubtitle.textContent = "Echo · Tier " + (item.tier || 1);
  } else if (page === "weapons") {
    modalSubtitle.textContent =
      (item.category || "Weapon") + (item.type ? " · " + item.type : "");
  } else if (page === "skills") {
    modalSubtitle.textContent =
      "Advanced Skill" + (item.category ? " · " + item.category : "");
  } else if (page === "armor") {
    modalSubtitle.textContent =
      "Armor" + (item.class ? " · " + item.class : "");
  } else if (page === "conditions") {
    modalSubtitle.textContent =
      "Condition" + (item.severity ? " · " + item.severity : "");
  } else {
    modalSubtitle.textContent = "";
  }

  // Pills
  modalPills.innerHTML = "";
  if (page === "echoes") {
    if (item.ephemCost)
      modalPills.appendChild(makePill("Ephem: " + item.ephemCost));
    if (item.damage)
      modalPills.appendChild(makePill("Damage: " + item.damage));
    if (item.range) modalPills.appendChild(makePill("Range: " + item.range));
    (item.tags || []).forEach((t) => modalPills.appendChild(makePill(t)));
  } else if (page === "weapons") {
    if (item.dicePool)
      modalPills.appendChild(makePill("Dice Pool: " + item.dicePool));
    if (item.damage)
      modalPills.appendChild(makePill("Damage: " + item.damage));
    if (item.penetration)
      modalPills.appendChild(makePill("Pen: " + item.penetration));
    if (item.reach)
      modalPills.appendChild(makePill("Reach: " + item.reach));
    (item.tags || []).forEach((t) => modalPills.appendChild(makePill(t)));
  } else if (page === "skills") {
    if (item.cost)
      modalPills.appendChild(makePill("Cost: " + item.cost));
    if (item.requirement)
      modalPills.appendChild(makePill("Req: " + item.requirement));
  } else if (page === "armor") {
    if (item.armorValue != null)
      modalPills.appendChild(makePill("Armor Value: " + item.armorValue));
    if (item.location)
      modalPills.appendChild(makePill("Location: " + item.location));
    (item.layers || []).forEach((layer) =>
      modalPills.appendChild(makePill(layer + " Layer"))
    );
  } else if (page === "conditions") {
    if (item.severity)
      modalPills.appendChild(makePill("Severity: " + item.severity));
  }

  // Body
  const bodyParts = [];

  if (item.summary) {
    bodyParts.push(`<p><strong>${item.summary}</strong></p>`);
  }

  if (item.rules && item.rules.length) {
    bodyParts.push(`<div class="modal-section-title">Rules</div>`);
    bodyParts.push("<ul>");
    item.rules.forEach((r) => {
      bodyParts.push(`<li>${r}</li>`);
    });
    bodyParts.push("</ul>");
  }

  if (page === "echoes" && item.tierUpgrades && item.tierUpgrades.length) {
    bodyParts.push(
      `<div class="modal-section-title">Tier Upgrades</div><ul>`
    );
    item.tierUpgrades.forEach((u) => {
      bodyParts.push(`<li>${u}</li>`);
    });
    bodyParts.push("</ul>");
  }

  if (page === "skills" && item.flavor) {
    bodyParts.push(
      `<div class="modal-section-title">Flavor</div><p>${item.flavor}</p>`
    );
  }

  modalBody.innerHTML = bodyParts.join("");

  modalBackdrop.classList.add("show");
}

function makePill(text) {
  const pill = document.createElement("span");
  pill.className = "modal-pill";
  pill.textContent = text;
  return pill;
}

function closeModal() {
  modalBackdrop.classList.remove("show");
}

/* ---------------------------------------------------
   EVENT WIRING
----------------------------------------------------*/

// Top nav
document.getElementById("topNav").addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  const btn = e.target.closest("button[data-page]");
  if (!btn) return;
  const page = btn.dataset.page;
  if (!page || page === currentPage) return;
  currentPage = page;
  currentFilter = null;
  currentSearch = "";
  document.getElementById("searchInput").value = "";

  // Active state
  [...document.querySelectorAll("#topNav button")].forEach((b) =>
    b.classList.toggle("active", b.dataset.page === currentPage)
  );

  renderChips();
  renderList();
});

// Chips
document.getElementById("chipRow").addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  const chip = e.target.closest(".chip");
  if (!chip) return;
  const val = chip.dataset.value;
  currentFilter = val === "All" ? null : val;

  [...document.querySelectorAll(".chip")].forEach((c) =>
    c.classList.toggle("active", c === chip)
  );

  renderList();
});

// Search
document.getElementById("searchInput").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderList();
});

// Click on list item -> open modal
document.getElementById("listContainer").addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  const card = e.target.closest(".item-card");
  if (!card) return;
  const id = card.dataset.id;
  const page = card.dataset.page;
  const config = pagesConfig[page];
  if (!config) return;
  const data = config.data();
  const item = data.find((x) => x.id === id);
  openModal(item, page);
});

// Modal close
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Initial render
renderChips();
renderList();
