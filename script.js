/* ---------------------------------------------------
   DATA
----------------------------------------------------*/

const echoesData = [
  {
    name: "Force Dart",
    ephemCost: 2,
    damage: "1 per bolt",
    range: '12"',
    description:
      "Fire 2 bolts of magical energy from your hands that always hit their target so long as they are in range and line of sight. Bolts can be split between targets or all hit the same target. You may spend additional Action Points to fire more bolts, 1 AP for 1 extra bolt.",
    tier2: "+1 Mana makes all Force Darts deal 2 damage per bolt.",
    tier3: "+2 Mana makes all Force Darts deal 3 damage per bolt."
  },
  {
    name: "Fire Spray",
    ephemCost: 2,
    damage: "2 (base)",
    range: '6" spray template',
    description:
      "Spray fire from your fingertips. Place the thin end of the spray template against your Ender’s base in the front arc, pick a target and center the template over their base. The target and all other models under the template take 2 damage and suffer the Burning effect. Starting on your next Upkeep, all Burning models take 1 damage, then Burning ends.",
    tier2:
      '+2 Mana: spray becomes 8" and damage becomes 3; Burning deals 2 damage then expires.',
    tier3:
      '+4 Mana: spray becomes 10" and damage becomes 4; Burning deals 2 damage and lasts 2 rounds, ending at the beginning of your turn.'
  },
  {
    name: "Acid Bath",
    ephemCost: 2,
    damage: "3 (base)",
    range: 'Throw (3" AOE)',
    description:
      'Make a Throw action and place a 3" AOE circle template centered on where the throw lands. All creatures under the template take 3 damage and suffer the Corrosive effect. The AOE remains for 3 turns; any model that enters the AOE suffers the Corrosive effect. Starting on your next Upkeep, any model suffering Corrosive has its Armor Class and Damage permanently reduced by 1. Corrosive lasts 2 rounds.',
    tier2:
      "+2 Mana: AOE becomes 4\"; Corrosive reduces Armor Class and Damage by 2 instead.",
    tier3:
      "+2 more Mana: AOE becomes 5\" and damage becomes 4; Corrosive still reduces Armor Class and Damage by 2."
  },
  {
    name: "Frost Bite",
    ephemCost: 2,
    damage: "5 (base)",
    range: '10"',
    description:
      'Target a model within range and line of sight. If hit, it suffers 5 damage. That model and any other models within 1" of it become Stationary during their next turn and have movement halved the following turn.',
    tier2: '+1 Mana: range becomes 13" and damage becomes 6.',
    tier3:
      '+1 more Mana: range stays 13" and damage 6; any other models within 2" of the hit target become Stationary next turn and have movement halved the following turn.'
  },
  {
    name: "Arc Bolt",
    ephemCost: 2,
    damage: "4 (base)",
    range: '6"',
    description:
      'Make a Cast action targeting a model within range and line of sight. Arc Bolt then jumps to another model of your choice within 3" of the first, then arcs one more time to a third model within 3" of that one. Each model hit takes 4 damage. A model cannot be hit more than once by the same casting. Models hit become Stunned for one round.',
    tier2: "+1 Mana: Arc Bolt jumps one additional time.",
    tier3: "+2 Mana: Arc Bolt jumps one additional time and damage becomes 5."
  },
  {
    name: "Chill Lock",
    ephemCost: 2,
    damage: "—",
    range: '8"',
    description:
      "Target up to 3 models within range and line of sight. Targets become Stationary until the beginning of your next turn.",
    tier2: "+1 Mana: target up to 4 models.",
    tier3: "+2 Mana: target up to 6 models."
  },
  {
    name: "Cripple",
    ephemCost: 2,
    damage: "—",
    range: '10"',
    description:
      "Make a Cast action targeting up to 2 models in range and line of sight. Models hit cannot make any attacks for 2 rounds, ending on your turn.",
    tier2: null,
    tier3: null
  },
  {
    name: "Arcane Armor",
    ephemCost: 2,
    damage: "—",
    range: '6"',
    description:
      "Choose a friendly model within range and line of sight. Target gains +2 Armor Class until the spell expires. The effect lasts one round, but you may spend 1 Mana at the beginning of each Player Upkeep to maintain it. You can only have 1 copy of this spell active at a time, and a model cannot have multiple copies from different sources; a new instance replaces the old.",
    tier2: "+2 Mana: Armor Class bonus becomes +4.",
    tier3:
      "+4 Mana: Armor Class +4 and you may have 2 active Arcane Armor effects at a time. You may spend 1 Mana for each active effect in Upkeep to maintain them."
  },
  {
    name: "Revive",
    ephemCost: 2,
    damage: "—",
    range: '½" (base contact)',
    description:
      "Target a friendly model in base contact that has fallen to 0 HP. That model gains 1 HP and becomes Prone.",
    tier2: "+2 Mana: HP restored becomes 5.",
    tier3: "+4 Mana: restore 5 HP and heal 1 Injury."
  },
  {
    name: "Light Barrier",
    ephemCost: 2,
    damage: "—",
    range: 'Self (3" AOE base)',
    description:
      'Summon a barrier of light to protect from ranged attacks. Place a 3" AOE circle template centered on your base. The barrier blocks any ranged attacks; it has 8 HP and ends if that HP is exceeded or after 1 round.',
    tier2: '+2 Mana: AOE becomes 4" and HP becomes 12.',
    tier3: '+4 Mana: AOE becomes 5" and HP becomes 18.'
  },
  {
    name: "Hasten",
    ephemCost: 2,
    damage: "—",
    range: '8"',
    description:
      "Choose a friendly model within range and line of sight. That model gains 2 extra Action Points; the spell expires at the end of the Player turn.",
    tier2: "+1 Mana: target also gains +1 movement speed.",
    tier3: "+2 Mana: target instead gains +3 movement speed."
  },
  {
    name: "Smoke Screen",
    ephemCost: null,
    damage: "—",
    range: "TBD",
    description:
      "Placeholder – rules for Smoke Screen are not yet fully defined in the current document. Refer to your latest design notes.",
    tier2: null,
    tier3: null
  }
];

const weaponsData = [
  // Melee
  {
    name: "Short Sword",
    category: "Melee",
    dieSize: "d8",
    diePool: 4,
    damage: 2,
    penetration: 3,
    durability: 4,
    type: "Slashing",
    range: '½"',
    hands: 1,
    cost: null,
    notes: ""
  },
  {
    name: "Long Sword",
    category: "Melee",
    dieSize: "d6",
    diePool: 3,
    damage: 3,
    penetration: 3,
    durability: 4,
    type: "Slashing",
    range: '1"',
    hands: 1,
    cost: null,
    notes: ""
  },
  {
    name: "Great Sword",
    category: "Melee",
    dieSize: "d6",
    diePool: 2,
    damage: 4,
    penetration: 4,
    durability: 4,
    type: "Slashing",
    range: '2"',
    hands: 2,
    cost: null,
    notes: ""
  },
  {
    name: "Rapier",
    category: "Melee",
    dieSize: "d8",
    diePool: 4,
    damage: 2,
    penetration: 6,
    durability: 3,
    type: "Piercing",
    range: '1"',
    hands: 1,
    cost: null,
    notes: ""
  },
  {
    name: "Dagger",
    category: "Melee",
    dieSize: "d10",
    diePool: 5,
    damage: 2,
    penetration: 5,
    durability: 4,
    type: "Piercing",
    range: '½"',
    hands: 1,
    cost: null,
    notes: ""
  },
  {
    name: "Hatchet",
    category: "Melee",
    dieSize: "d8",
    diePool: 3,
    damage: 3,
    penetration: 3,
    durability: 5,
    type: "Cleave",
    range: '½"',
    hands: 1,
    cost: null,
    notes: ""
  },
  {
    name: "Battle Axe",
    category: "Melee",
    dieSize: "d6",
    diePool: 2,
    damage: 4,
    penetration: 4,
    durability: 5,
    type: "Cleave",
    range: '1"',
    hands: 2,
    cost: null,
    notes: ""
  },
  {
    name: "Hammer",
    category: "Melee",
    dieSize: "d8",
    diePool: 4,
    damage: 4,
    penetration: 2,
    durability: 6,
    type: "Blunt",
    range: '½"',
    hands: 1,
    cost: null,
    notes: ""
  },
  {
    name: "Great Hammer",
    category: "Melee",
    dieSize: "d6",
    diePool: 2,
    damage: 5,
    penetration: 2,
    durability: 6,
    type: "Blunt",
    range: '1"',
    hands: 2,
    cost: null,
    notes: ""
  },
  {
    name: "Mace",
    category: "Melee",
    dieSize: "d8",
    diePool: 3,
    damage: 3,
    penetration: 3,
    durability: 6,
    type: "Blunt",
    range: '½"',
    hands: 1,
    cost: null,
    notes: ""
  },
  {
    name: "Flail",
    category: "Melee",
    dieSize: "d8",
    diePool: 3,
    damage: 3,
    penetration: 3,
    durability: 6,
    type: "Blunt",
    range: '1"',
    hands: 1,
    cost: null,
    notes: ""
  },
  {
    name: "Halberd",
    category: "Melee",
    dieSize: "d6",
    diePool: 2,
    damage: 4,
    penetration: 4,
    durability: 5,
    type: "Cleave",
    range: '2"',
    hands: 2,
    cost: null,
    notes: ""
  },
  {
    name: "Spear",
    category: "Melee",
    dieSize: "d8",
    diePool: "3/4",
    damage: 3,
    penetration: 6,
    durability: 4,
    type: "Piercing",
    range: '2"',
    hands: 2,
    cost: null,
    notes: ""
  },

  // Ranged
  {
    name: "Short Bow",
    category: "Ranged",
    dieSize: "d8",
    diePool: 3,
    damage: 3,
    penetration: 5,
    durability: null,
    type: "Piercing",
    description: "Drawn",
    hands: 2,
    cost: null,
    rangeBands: {
      close: '1–5" (-1 TN)',
      effective: '5–15" (0)',
      far: '15–20" (-1)',
      max: '20–25" (-2)'
    }
  },
  {
    name: "Longbow",
    category: "Ranged",
    dieSize: "d6",
    diePool: 2,
    damage: 4,
    penetration: 6,
    durability: null,
    type: "Piercing",
    description: "Drawn",
    hands: 2,
    cost: null,
    rangeBands: {
      close: '2–6" (-1)',
      effective: '6–18" (0)',
      far: '18–26" (-1)',
      max: '26–32" (-2)'
    }
  },
  {
    name: "Crossbow",
    category: "Ranged",
    dieSize: "d8",
    diePool: 1,
    damage: 5,
    penetration: 3,
    durability: null,
    type: "Piercing",
    description: "Mechanical",
    hands: 1,
    cost: null,
    rangeBands: {
      close: '1–4" (-1)',
      effective: '4–12" (0)',
      far: '12–16" (-1)',
      max: '16–20" (-2)'
    }
  },
  {
    name: "Heavy Crossbow",
    category: "Ranged",
    dieSize: "d6",
    diePool: 1,
    damage: 6,
    penetration: 4,
    durability: null,
    type: "Piercing",
    description: "Mechanical",
    hands: 2,
    cost: null,
    rangeBands: {
      close: '1–6" (-1)',
      effective: '6–16" (0)',
      far: '16–20" (-1)',
      max: '20–24" (-2)'
    }
  },
  {
    name: "Sling",
    category: "Ranged",
    dieSize: "d8",
    diePool: 2,
    damage: 4,
    penetration: 2,
    durability: null,
    type: "Blunt",
    description: "Sling",
    hands: 1,
    cost: null,
    rangeBands: {
      close: '1–6" (-1)',
      effective: '6–14" (0)',
      far: '14–20" (-1)',
      max: '20–24" (-2)'
    }
  },
  {
    name: "Pistol",
    category: "Ranged",
    dieSize: "d10",
    diePool: 2,
    damage: 4,
    penetration: 4,
    durability: null,
    type: "Piercing",
    description: "Mechanical",
    hands: 1,
    cost: null,
    rangeBands: {
      close: '1–8" (-1)',
      effective: '8–12" (0)',
      far: '12–16" (-1)',
      max: null
    }
  },
  {
    name: "Rifle",
    category: "Ranged",
    dieSize: "d6",
    diePool: 2,
    damage: 5,
    penetration: 6,
    durability: null,
    type: "Piercing",
    description: "Mechanical",
    hands: 2,
    cost: null,
    rangeBands: {
      close: '2–8" (-1)',
      effective: '8–18" (0)',
      far: '18–24" (-1)',
      max: '24–30" (-2)'
    }
  },

  // Thrown placeholder
  {
    name: "Javelin",
    category: "Thrown",
    dieSize: null,
    diePool: null,
    damage: null,
    penetration: null,
    durability: null,
    type: "Piercing",
    range: "TBD",
    hands: 1,
    cost: 1,
    notes:
      "Stats not fully defined in current sheet; treat as thrown weapon per your latest rules."
  }
];

const advancedSkillsData = [
  {
    name: "Stat Upgrade",
    requirement: null,
    cost: "—",
    effect:
      "Raise any one stat (Fight, Volley, Guts, Grit, or Focus) by +1, up to a maximum of 3."
  },
  {
    name: "Fleet Step",
    requirement: null,
    cost: "—",
    effect:
      "Increase Walk and Run speeds (per your latest movement table; originally 4\"→5\" and 6\"→7\" in an older draft)."
  },
  {
    name: "Iron Reserves",
    requirement: null,
    cost: "—",
    effect: "Raise your Stamina pool by +1."
  },
  {
    name: "Ephem Pool (Initial)",
    requirement: null,
    cost: "—",
    effect:
      "Unlocks Echo Channeling and grants an Ephem pool based on rank (I–IV) and Echoes Prepared limits."
  },
  {
    name: "Ephem Pool Upgrade",
    requirement: null,
    cost: "—",
    effect: "Increase your maximum Ephem pool (exact increments TBD)."
  },
  {
    name: "Ephem Regeneration Upgrade",
    requirement: null,
    cost: "—",
    effect: "Increase Ephem regeneration per turn (1→2, then 2→3)."
  },
  {
    name: "Weapon Second Function",
    requirement: null,
    cost: "—",
    effect: "Placeholder – mechanics and options still to be defined."
  },
  {
    name: "Circle of Iron",
    requirement:
      "Two-handed Slashing, Blunt, or Cleave weapon (not Piercing).",
    cost: "2 AP + 2 Stamina",
    effect:
      "Make a Fight action. Roll your normal melee dice pool plus 1 extra die for each enemy within melee range (360°). Hits may be assigned to any enemies in range regardless of facing."
  },
  {
    name: "Shadow Step",
    requirement: null,
    cost: "1 Ephem",
    effect:
      "Teleport up to 3\" ignoring terrain and models as long as your base fits in the destination."
  },
  {
    name: "Lunge",
    requirement: "Piercing weapon",
    cost: "2 AP + 1 Stamina",
    effect: "Increase melee range of your attack by +1\"."
  },
  {
    name: "Phantom Shot",
    requirement: null,
    cost: "2 AP (Volley) + 1 Ephem",
    effect:
      "When you make a Volley action, the attack ignores line of sight."
  },
  {
    name: "Ground Slam",
    requirement: "Blunt weapon",
    cost: "2 AP + scaling Ephem (1–3)",
    effect:
      'Create a shockwave around you: 1 Ephem = 3" radius, 2 = 4", 3 = 5". All enemies in radius take 3 damage; Small/Medium enemies are pushed out of the radius.'
  },
  {
    name: "Earthshatter",
    requirement: "Blunt weapon",
    cost: "2 AP + 2 Ephem",
    effect:
      'Create a 6" spray template from your base. All enemies in the template take 3 damage and are knocked Prone.'
  },
  {
    name: "Shield Bash",
    requirement: "Shield equipped",
    cost: "2 AP (sometimes noted 1 AP in draft)",
    effect:
      "Make a Fight action using 1d8. Small and Medium enemies hit are knocked Prone."
  },
  {
    name: "Heavy Bash",
    requirement: "Blunt weapon",
    cost: "2 AP",
    effect:
      "Make a Fight action targeting a shielded enemy. On a hit, their shield provides no benefit until the end of your turn."
  },
  {
    name: "Intimidating Shout",
    requirement: null,
    cost: "2 AP",
    effect:
      'All enemies within 10" must target you on their next activation if able, moving toward you and attacking if possible. Place a Two-Turn token next to your model.'
  },
  {
    name: "Sharpened Instinct",
    requirement: null,
    cost: "1 Stamina",
    effect:
      "Before a Fight, Volley, or targeted Echo attack roll, spend 1 Stamina to increase your Direct Hit window by +1 for that action (e.g., d8 Direct Hits on 7–8). Stacks with other modifiers."
  },
  {
    name: "Dual Wield",
    requirement: "Two one-handed weapons equipped",
    cost: "—",
    effect:
      "When making a Fight action while dual-wielding, halve the dice pool of each weapon (round up) and roll them together. Die sizes stay the same; allocate hits following normal melee rules."
  },
  {
    name: "Leap",
    requirement: null,
    cost: "1 AP + 1 Ephem",
    effect:
      'Choose a facing, then jump up to 6" straight ahead (including vertically). You may leap over terrain and Small/Medium enemies if the landing space is clear. End facing unchanged.'
  },
  {
    name: "Riposte",
    requirement: "You must have successfully Parried a melee attack",
    cost: "1 Stamina",
    effect:
      "After a successful Parry, roll 1d8 with Fight as TN adjustment. On success, deal your weapon’s base damage to the attacker; Direct Hits apply."
  },
  {
    name: "Grinding Edge",
    requirement: "Cleave weapon",
    cost: "1 Stamina",
    effect:
      'When you score a Direct Hit with a Cleave weapon, after resolving damage against the primary target, choose one enemy within 1" of that target; it takes 2 damage ignoring armor.'
  },
  {
    name: "Reflexive Guard",
    requirement: "Shield equipped",
    cost: "1 Stamina",
    effect:
      "After an enemy’s attack roll against you is made but before damage, cancel that attack entirely. Your shield takes 1 Durability damage. You may use this multiple times per enemy turn while you can pay Stamina and have Durability."
  },
  {
    name: "Veil Point",
    requirement: "Spear",
    cost: "1 Ephem",
    effect:
      'When making a Fight action with a spear, increase melee range by +1" as a blade of force extends from the tip.'
  },
  {
    name: "Reaving Cut",
    requirement: "Slashing weapon",
    cost: "1 Stamina",
    effect:
      "Before a Fight action with a Slashing weapon, spend 1 Stamina. If that attack scores any Direct Hits, choose one enemy that took a Direct Hit; that enemy suffers +1 Bleed in addition to normal Bleed from Slashing (once per attack)."
  }
];

const armorData = [
  // Full armor class table
  {
    name: "Padded",
    armorValue: 6,
    reduction: 2,
    durability: 5,
    resistance: "None",
    armorClass: "Light",
    location: "Torso, Arms, Legs (generic set)",
    cost: null,
    weight: null
  },
  {
    name: "Leather",
    armorValue: 7,
    reduction: 3,
    durability: 6,
    resistance: "Slashing",
    armorClass: "Light",
    location: "Torso, Arms, Legs",
    cost: null,
    weight: null
  },
  {
    name: "Brigandine",
    armorValue: 8,
    reduction: 3,
    durability: 6,
    resistance: "Slashing, Blunt",
    armorClass: "Medium",
    location: "Torso, Arms, Legs",
    cost: null,
    weight: null
  },
  {
    name: "Chain Mail",
    armorValue: 9,
    reduction: 4,
    durability: 7,
    resistance: "Slashing, Blunt",
    armorClass: "Medium",
    location: "Torso, Arms, Legs",
    cost: null,
    weight: null
  },
  {
    name: "Scale",
    armorValue: 10,
    reduction: 5,
    durability: 8,
    resistance: "Slashing, Piercing",
    armorClass: "Heavy",
    location: "Torso, Arms, Legs",
    cost: null,
    weight: null
  },
  {
    name: "Plate",
    armorValue: 11,
    reduction: 5,
    durability: 8,
    resistance: "Slashing, Piercing",
    armorClass: "Heavy",
    location: "Torso, Arms, Legs",
    cost: null,
    weight: null
  },

  // Modular soft layers
  {
    name: "Padded Jacket",
    armorValue: 3,
    reduction: 1,
    durability: 3,
    resistance: "—",
    armorClass: "Soft layer",
    location: "Torso, Arms",
    layer: "Base",
    cost: 3,
    weight: null
  },
  {
    name: "Gambeson",
    armorValue: 4,
    reduction: 2,
    durability: 4,
    resistance: "Blunt",
    armorClass: "Soft layer",
    location: "Torso, Arms",
    layer: "Base",
    cost: 4,
    weight: null
  },
  {
    name: "Arming Coat",
    armorValue: 5,
    reduction: 2,
    durability: 4,
    resistance: "Blunt",
    armorClass: "Soft layer",
    location: "Torso, Arms",
    layer: "Base",
    cost: 5,
    weight: null
  },
  {
    name: "Padded Coif",
    armorValue: null,
    reduction: null,
    durability: null,
    resistance: null,
    armorClass: "Soft layer",
    location: "Head",
    layer: "Base",
    cost: null,
    weight: null,
    notes: "Stats TBD in design doc."
  },
  {
    name: "Gambeson Hood",
    armorValue: null,
    reduction: null,
    durability: null,
    resistance: null,
    armorClass: "Soft layer",
    location: "Head",
    layer: "Base",
    cost: null,
    weight: null,
    notes: "Stats TBD."
  },
  {
    name: "Arming Cap",
    armorValue: null,
    reduction: null,
    durability: null,
    resistance: null,
    armorClass: "Soft layer",
    location: "Head",
    layer: "Base",
    cost: null,
    weight: null,
    notes: "Stats TBD."
  },
  {
    name: "Chainmail Vest",
    armorValue: null,
    reduction: null,
    durability: null,
    resistance: "—",
    armorClass: "Flexible mid layer",
    location: "Torso",
    layer: "Mid",
    cost: 10,
    weight: null
  },
  {
    name: "Chainmail Shirt",
    armorValue: null,
    reduction: null,
    durability: null,
    resistance: "—",
    armorClass: "Flexible mid layer",
    location: "Torso, Arms",
    layer: "Mid",
    cost: 15,
    weight: null
  }
];

const conditionsData = [
  {
    name: "Bleed",
    description:
      "Ongoing damage from Slashing weapons or certain skills. Typically causes damage during Upkeep until removed; exact damage and duration per effect (e.g., Bleed 1, extra Bleed from Reaving Cut)."
  },
  {
    name: "Burning",
    description:
      "Applied by Fire Spray and similar effects. Burning models take damage during the next Upkeep (often 1–2 damage depending on Echo tier) then the effect expires unless otherwise stated."
  },
  {
    name: "Corrosive",
    description:
      "Applied by Acid Bath. While affected, a model’s Armor Class and Damage are permanently reduced (usually by 1 or 2 depending on tier) over 2 rounds."
  },
  {
    name: "Stunned",
    description:
      "Applied by Arc Bolt and other effects. A Stunned model loses actions for one round or suffers attack/defense penalties (use your current rules text)."
  },
  {
    name: "Stationary",
    description:
      "From Frost Bite and Chill Lock. Stationary models cannot move during their turn; some effects also halve movement on the following turn."
  },
  {
    name: "Prone",
    description:
      "From Earthshatter, Shield Bash, Revive, etc. Prone models are on the ground; attacks against them or their movement are usually affected per your core rules."
  },
  {
    name: "Broken Armor",
    description:
      "When a location’s armor Durability reaches 0, its Armor Value is reduced by 3, Damage Reduction by 2, and it loses all Resistances until repaired."
  }
];

/* ---------------------------------------------------
   STATE
----------------------------------------------------*/

let currentPage = "echoes";
let currentSearch = "";
let currentFilter = null; // Filter value or null

const pagesConfig = {
  echoes: {
    label: "Echoes",
    data: () => echoesData,
    filterLabel: "Type",
    // For now we only have "All" since no per-echo type field yet.
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
    chipOptions: ["All"] // no categories yet on skills
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
    chipOptions: ["All"] // no severity field yet
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
      // no type defined yet, so no real filtering
      return true;

    case "weapons":
      return normalize(item.category) === normalize(currentFilter);

    case "skills":
      // no category yet
      return true;

    case "armor":
      return normalize(item.armorClass) === normalize(currentFilter);

    case "conditions":
      // no severity yet
      return true;

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
    card.dataset.id = item.name; // use name as key
    card.dataset.page = currentPage;

    const main = document.createElement("div");
    main.className = "item-main";

    const title = document.createElement("div");
    title.className = "item-title";

    let displayName = item.name || "";
    if (currentPage === "weapons" && item.type) {
    displayName = `${item.name} - ${item.type}`;
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
  // Build a concise stat line, e.g. "4d8 · Damage 2 · Pen 3 · Range 1\""
  const stats = [];

  // 4d8 from diePool + dieSize
  if (item.diePool && item.dieSize) {
    stats.push(`${item.diePool}${item.dieSize}`);
  } else if (item.diePool) {
    stats.push(String(item.diePool));
  }

  // Damage
  if (item.damage != null) {
    stats.push(`Damage ${item.damage}`);
  }

  // Penetration
  if (item.penetration != null) {
    stats.push(`Pen ${item.penetration}`);
  }

  // Range
  if (item.range) {
    stats.push(`Range ${item.range}`);
  }

  meta.textContent = stats.join(" · ");
} else if (currentPage === "skills") {

      meta.textContent =
        "Advanced Skill" + (item.cost ? " · Cost " + item.cost : "");
    } else if (currentPage === "armor") {
  // Build a concise armor stat line:
  // e.g. "Torso, Arms, Legs · AV 6 · Red 2 · Dur 5 · Res Slashing"
  const parts = [];

  if (item.location) {
    parts.push(item.location);
  }
  if (item.armorValue != null) {
    parts.push(`AV ${item.armorValue}`);
  }
  if (item.reduction != null) {
    parts.push(`Red ${item.reduction}`);
  }
  if (item.durability != null) {
    parts.push(`Dur ${item.durability}`);
  }
  if (item.resistance) {
    parts.push(`Res ${item.resistance}`);
  }

  meta.textContent = parts.join(" · ");
} else if (currentPage === "conditions") {

      meta.textContent = "Condition";
    }

    const tagline = document.createElement("div");
    tagline.className = "item-tagline";
    tagline.textContent =
      item.summary || item.description || item.effect || "";

    main.appendChild(title);
    main.appendChild(meta);
    if (tagline.textContent) main.appendChild(tagline);

    const pill = document.createElement("div");
    pill.className = "item-pill";

    if (currentPage === "echoes") {
      pill.textContent = "Echo";
    } else if (currentPage === "weapons") {
      pill.textContent = item.category || "Weapon";
    } else if (currentPage === "skills") {
      pill.textContent = "Skill";
    } else if (currentPage === "armor") {
      pill.textContent = item.armorClass || "Armor";
    } else if (currentPage === "conditions") {
      pill.textContent = "Condition";
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
    modalSubtitle.textContent = "Echo";
  } else if (page === "weapons") {
    modalSubtitle.textContent =
      (item.category || "Weapon") + (item.type ? " · " + item.type : "");
  } else if (page === "skills") {
    modalSubtitle.textContent = "Advanced Skill";
  } else if (page === "armor") {
    modalSubtitle.textContent =
      "Armor" + (item.armorClass ? " · " + item.armorClass : "");
  } else if (page === "conditions") {
    modalSubtitle.textContent = "Condition";
  } else {
    modalSubtitle.textContent = "";
  }

  // Pills
  modalPills.innerHTML = "";

  if (page === "echoes") {
    if (item.ephemCost != null)
      modalPills.appendChild(makePill("Ephem: " + item.ephemCost));
    if (item.damage)
      modalPills.appendChild(makePill("Damage: " + item.damage));
    if (item.range)
      modalPills.appendChild(makePill("Range: " + item.range));
  } else if (page === "weapons") {
    if (item.diePool != null) {
      modalPills.appendChild(
        makePill(
          "Dice Pool: " +
            item.diePool +
            (item.dieSize ? item.dieSize : "")
        )
      );
    }
    if (item.damage != null)
      modalPills.appendChild(makePill("Damage: " + item.damage));
    if (item.penetration != null)
      modalPills.appendChild(makePill("Pen: " + item.penetration));
    if (item.range) modalPills.appendChild(makePill("Range: " + item.range));
    if (item.description)
      modalPills.appendChild(makePill(item.description));
  } else if (page === "skills") {
    if (item.cost)
      modalPills.appendChild(makePill("Cost: " + item.cost));
    if (item.requirement)
      modalPills.appendChild(makePill("Req: " + item.requirement));
  } else if (page === "armor") {
    if (item.armorValue != null)
      modalPills.appendChild(makePill("Armor Value: " + item.armorValue));
    if (item.reduction != null)
      modalPills.appendChild(makePill("Reduction: " + item.reduction));
    if (item.resistance)
      modalPills.appendChild(makePill("Resist: " + item.resistance));
    if (item.location)
      modalPills.appendChild(makePill("Location: " + item.location));
    if (item.layer)
      modalPills.appendChild(makePill("Layer: " + item.layer));
  } else if (page === "conditions") {
    // nothing extra for now
  }

  // Body
  const bodyParts = [];

  // Main summary/description/effect
  if (item.summary || item.description || item.effect) {
    bodyParts.push(
      `<p><strong>${item.summary || item.description || item.effect}</strong></p>`
    );
  }

  // Echo tier upgrades (from tier2 / tier3)
  if (page === "echoes") {
    const upgrades = [item.tier2, item.tier3].filter(Boolean);
    if (upgrades.length) {
      bodyParts.push(
        `<div class="modal-section-title">Tier Upgrades</div><ul>`
      );
      upgrades.forEach((u) => {
        bodyParts.push(`<li>${u}</li>`);
      });
      bodyParts.push("</ul>");
    }
  }

  // Skills: Effect section (if we didn't already highlight it)
  if (page === "skills" && item.effect) {
    bodyParts.push(
      `<div class="modal-section-title">Effect</div><p>${item.effect}</p>`
    );
  }

  // Weapons: Range bands table if present
  if (page === "weapons" && item.rangeBands) {
    bodyParts.push(
      `<div class="modal-section-title">Range Bands</div><ul>`
    );
    const rb = item.rangeBands;
    if (rb.close) bodyParts.push(`<li>Close: ${rb.close}</li>`);
    if (rb.effective) bodyParts.push(`<li>Effective: ${rb.effective}</li>`);
    if (rb.far) bodyParts.push(`<li>Far: ${rb.far}</li>`);
    if (rb.max) bodyParts.push(`<li>Max: ${rb.max}</li>`);
    bodyParts.push("</ul>");
  }

  // Armor: extra details section
  if (page === "armor") {
    const lines = [];
    if (item.durability != null) lines.push(`Durability: ${item.durability}`);
    if (item.cost != null) lines.push(`Cost: ${item.cost}`);
    if (item.weight != null) lines.push(`Weight: ${item.weight}`);
    if (item.notes) lines.push(item.notes);

    if (lines.length) {
      bodyParts.push(
        `<div class="modal-section-title">Details</div><ul>`
      );
      lines.forEach((l) => bodyParts.push(`<li>${l}</li>`));
      bodyParts.push("</ul>");
    }
  }

  // Conditions: description already shown above as main text

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
  const key = card.dataset.id;
  const page = card.dataset.page;
  const config = pagesConfig[page];
  if (!config) return;
  const data = config.data();
  const item = data.find((x) => x.name === key);
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
