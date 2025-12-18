/* ---------------------------------------------------
   BLIGHTSEND APP ROUTER + COMPENDIUM + CHARACTER SHEET
   (Single-file script.js replacement)
----------------------------------------------------*/

/* ===================================================
   1) DATA (UNCHANGED)
=================================================== */

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

// Armor data imported from CSV attachment (ARMOR - Armor.csv)
const armorData = [
  { name: "Padded Coif", armorValue: 2, reduction: 1, durability: 2, resistance: "None", location: "Head", layer: "Base", weight: 1, cost: null },
  { name: "Gambeson Hood", armorValue: 3, reduction: 1, durability: 2, resistance: "Blunt, Slashing", location: "Head", layer: "Base", weight: 2, cost: null },
  { name: "Arming Cap", armorValue: 3, reduction: 1, durability: 3, resistance: "Blunt", location: "Head", layer: "Base", weight: 2, cost: null },
  { name: "Leather Skull Cap", armorValue: 3, reduction: 1, durability: 3, resistance: "Slashing", location: "Head", layer: "Base", weight: 3, cost: null },

  { name: "Padded Waistcoat", armorValue: 2, reduction: 1, durability: 2, resistance: "None", location: "Torso", layer: "Base", weight: 2, cost: null },
  { name: "Gambeson Vest", armorValue: 3, reduction: 1, durability: 2, resistance: "Blunt, Slashing", location: "Torso", layer: "Base", weight: 4, cost: null },
  { name: "Arming Gilet", armorValue: 3, reduction: 1, durability: 3, resistance: "Blunt", location: "Torso", layer: "Base", weight: 3, cost: null },
  { name: "Leather Jerkin", armorValue: 3, reduction: 1, durability: 3, resistance: "Slashing", location: "Torso", layer: "Base", weight: 5, cost: null },

  { name: "Padded Jacket", armorValue: 2, reduction: 1, durability: 2, resistance: "None", location: "Torso, Arms", layer: "Base", weight: 3, cost: null },
  { name: "Gambeson", armorValue: 3, reduction: 1, durability: 2, resistance: "Blunt, Slashing", location: "Torso, Arms", layer: "Base", weight: 5, cost: null },
  { name: "Arming Coat", armorValue: 3, reduction: 1, durability: 3, resistance: "Blunt", location: "Torso, Arms", layer: "Base", weight: 4, cost: null },
  { name: "Leather Doublet", armorValue: 3, reduction: 1, durability: 3, resistance: "Slashing", location: "Torso, Arms", layer: "Base", weight: 6, cost: null },

  { name: "Padded Sleeves", armorValue: 2, reduction: 1, durability: 2, resistance: "None", location: "Arms", layer: "Base", weight: 1, cost: null },
  { name: "Gambeson Sleeves", armorValue: 3, reduction: 1, durability: 2, resistance: "Blunt, Slashing", location: "Arms", layer: "Base", weight: 2, cost: null },
  { name: "Arming Sleeves", armorValue: 3, reduction: 1, durability: 3, resistance: "Blunt", location: "Arms", layer: "Base", weight: 2, cost: null },

  { name: "Padded Chausses", armorValue: 2, reduction: 1, durability: 2, resistance: "None", location: "Legs", layer: "Base", weight: 2, cost: null },
  { name: "Gambeson Trousers", armorValue: 3, reduction: 1, durability: 2, resistance: "Blunt, Slashing", location: "Legs", layer: "Base", weight: 4, cost: null },
  { name: "Arming Pants", armorValue: 3, reduction: 1, durability: 3, resistance: "Blunt", location: "Legs", layer: "Base", weight: 3, cost: null },

  { name: "Chainmail Coif", armorValue: 4, reduction: 2, durability: 4, resistance: "Slashing", location: "Head", layer: "Mid", weight: 5, cost: null },
  { name: "Chainmail Vest", armorValue: 4, reduction: 2, durability: 4, resistance: "Slashing", location: "Torso", layer: "Mid", weight: 8, cost: null },
  { name: "Chainmail Hauberk", armorValue: 4, reduction: 2, durability: 4, resistance: "Slashing", location: "Torso, Arms", layer: "Mid", weight: 12, cost: null },
  { name: "Chainmail Voiders", armorValue: 4, reduction: 2, durability: 4, resistance: "Slashing", location: "Arms", layer: "Mid", weight: 5, cost: null },
  { name: "Chainmail Chausses", armorValue: 4, reduction: 2, durability: 4, resistance: "Slashing", location: "Legs", layer: "Mid", weight: 6, cost: null },

  { name: "Leather Helm", armorValue: 4, reduction: 2, durability: 3, resistance: "Slashing", location: "Head", layer: "Flexible Outer", weight: 4, cost: null },
  { name: "Segmented Helmet", armorValue: 5, reduction: 3, durability: 4, resistance: "Blunt, Slashing", location: "Head", layer: "Flexible Outer", weight: 4, cost: null },
  { name: "Lamellar Helm", armorValue: 5, reduction: 3, durability: 4, resistance: "Blunt, Slashing", location: "Head", layer: "Flexible Outer", weight: 4, cost: null },

  { name: "Leather Cuirass", armorValue: 4, reduction: 2, durability: 3, resistance: "Slashing", location: "Torso", layer: "Flexible Outer", weight: 6, cost: null },
  { name: "Scale Hauberk", armorValue: 5, reduction: 3, durability: 4, resistance: "Slashing", location: "Torso", layer: "Flexible Outer", weight: 7, cost: null },
  { name: "Lamellar Harness", armorValue: 5, reduction: 3, durability: 4, resistance: "Slashing, Piercing", location: "Torso", layer: "Flexible Outer", weight: 8, cost: null },
  { name: "Brigandine Coat", armorValue: 5, reduction: 3, durability: 4, resistance: "Blunt, Slashing", location: "Torso", layer: "Flexible Outer", weight: 7, cost: null },

  { name: "Leather Vambraces", armorValue: 4, reduction: 2, durability: 3, resistance: "Slashing", location: "Arms", layer: "Flexible Outer", weight: 3, cost: null },
  { name: "Scale Sleeves", armorValue: 5, reduction: 3, durability: 4, resistance: "Slashing", location: "Arms", layer: "Flexible Outer", weight: 4, cost: null },
  { name: "Segmented Arm Guards", armorValue: 5, reduction: 3, durability: 4, resistance: "Blunt, Slashing", location: "Arms", layer: "Flexible Outer", weight: 4, cost: null },
  { name: "Lamellar Rerebraces", armorValue: 5, reduction: 3, durability: 4, resistance: "Slashing, Piercing", location: "Arms", layer: "Flexible Outer", weight: 5, cost: null },

  { name: "Leather Leg Guards", armorValue: 4, reduction: 2, durability: 3, resistance: "Slashing", location: "Legs", layer: "Flexible Outer", weight: 4, cost: null },
  { name: "Scale Greaves", armorValue: 5, reduction: 3, durability: 4, resistance: "Slashing", location: "Legs", layer: "Flexible Outer", weight: 5, cost: null },
  { name: "Brigandine Tassets", armorValue: 5, reduction: 3, durability: 4, resistance: "Blunt, Slashing", location: "Legs", layer: "Flexible Outer", weight: 5, cost: null },
  { name: "Lamellar Cuisses", armorValue: 5, reduction: 3, durability: 4, resistance: "Slashing, Piercing", location: "Legs", layer: "Flexible Outer", weight: 6, cost: null },

  { name: "Nasal Helm", armorValue: 6, reduction: 4, durability: 5, resistance: "Slashing, Piercing", location: "Head", layer: "Rigid Outer", weight: 4, cost: null },
  { name: "Plate Helm", armorValue: 6, reduction: 5, durability: 5, resistance: "Slashing, Piercing", location: "Head", layer: "Rigid Outer", weight: 5, cost: null },
  { name: "Great Helm", armorValue: 7, reduction: 5, durability: 6, resistance: "Slashing, Piercing", location: "Head", layer: "Rigid Outer", weight: 6, cost: null },

  { name: "Breastplate", armorValue: 6, reduction: 4, durability: 5, resistance: "Slashing, Piercing", location: "Torso", layer: "Rigid Outer", weight: 10, cost: null },
  { name: "Field Plate", armorValue: 6, reduction: 5, durability: 5, resistance: "Slashing, Piercing", location: "Torso", layer: "Rigid Outer", weight: 12, cost: null },
  { name: "Full Plate Harness", armorValue: 7, reduction: 5, durability: 6, resistance: "Slashing, Piercing", location: "Torso", layer: "Rigid Outer", weight: 14, cost: null },

  { name: "Plate Vambraces", armorValue: 6, reduction: 4, durability: 5, resistance: "Slashing, Piercing", location: "Arms", layer: "Rigid Outer", weight: 6, cost: null },
  { name: "Full Plate Arms", armorValue: 6, reduction: 5, durability: 5, resistance: "Slashing, Piercing", location: "Arms", layer: "Rigid Outer", weight: 8, cost: null },
  { name: "Reinforced Plate", armorValue: 7, reduction: 5, durability: 6, resistance: "Slashing, Piercing", location: "Arms", layer: "Rigid Outer", weight: 9, cost: null },

  { name: "Plate Greaves", armorValue: 6, reduction: 4, durability: 5, resistance: "Slashing, Piercing", location: "Legs", layer: "Rigid Outer", weight: 7, cost: null },
  { name: "Full Plate Legs", armorValue: 6, reduction: 5, durability: 5, resistance: "Slashing, Piercing", location: "Legs", layer: "Rigid Outer", weight: 9, cost: null },
  { name: "Reinforced", armorValue: 7, reduction: 5, durability: 6, resistance: "Slashing, Piercing", location: "Legs", layer: "Rigid Outer", weight: 10, cost: null }
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
    /* Compendium quick-list meta for armor */
    .item-meta .meta-top{ font-weight:600; margin-bottom:4px; }
    .item-meta .meta-bottom{ font-size:0.92rem; opacity:0.92; }

    /* Armor modal detail grid */
    .armor-detail-grid{ display:flex; gap:1rem; align-items:flex-start; margin-top:0.5rem; }
    .armor-detail-left, .armor-detail-right{ flex:1; }
    .armor-stat-row{ display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px solid rgba(255,255,255,0.03); }
    .armor-stat-row .stat-label{ opacity:0.88; }
    .armor-stat-row .stat-value{ font-weight:700; }
    .armor-meta-row{ padding:0.35rem 0; }
    .modal-section-title{ margin-top:0.75rem; font-weight:700; }
  `;
  document.head.appendChild(style);
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
        <img class="sheet-title-logo" src="assets/BlightsEnd-Logo.png" alt="BlightsEnd" />
        <!-- Coins field: icon + numeric input (uses existing numField for steppers) -->
        <div class="sheet-coins" id="sheetCoins">
          <img class="sheet-coin-icon" src="Icons/coin-icon.png" alt="Coins">
          <label class="sheet-coin-label" for="cs_coins">Coins</label>
          ${numField("cs_coins")}
        </div>
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
    btnGoSheet.addEventListener("click", () => navigate("sheet"));
  }
  if (btnGoCompendium && !btnGoCompendium.dataset.bound) {
    btnGoCompendium.dataset.bound = "1";
    btnGoCompendium.addEventListener("click", () => navigate("compendium"));
  }

  // Wire sheet menu overlay once
  const openSheetMenu = $("#openSheetMenu");
  if (openSheetMenu && !openSheetMenu.dataset.bound) {
    openSheetMenu.dataset.bound = "1";
    openSheetMenu.addEventListener("click", () => toggleSheetMenu(true));
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

  // Armor overlay: create/inject markup (if not present)
  if (!$("#armorOverlay")) {
    const armorOverlay = document.createElement('div');
    armorOverlay.id = 'armorOverlay';
    armorOverlay.className = 'armor-backdrop';
    armorOverlay.setAttribute('aria-hidden','true');
    armorOverlay.innerHTML = `
      <div class="armor-modal">
        <div class="armor-modal-header">
          <div class="armor-title">Armor</div>
          <button class="armor-close" id="armorCloseBtn">✕</button>
        </div>
        <div class="armor-body">
          <div class="armor-stage">
            <div class="armor-section" data-slot="head" data-grid="head">
              <div class="armor-slot-title">Head</div>
              <input class="armor-select" data-slot="head" placeholder="Armor piece" />
              <div class="armor-stats">
                <div>Armor Value: <span class="stat av">-</span></div>
                <div>Reduction: <span class="stat red">-</span></div>
                <div>Durability: <span class="stat dur">-</span></div>
                <div>Injury: <input type="checkbox" class="armor-injury" data-slot="head" /></div>
              </div>
            </div>

            <div class="armor-section" data-slot="torso" data-grid="torso">
              <div class="armor-slot-title">Torso</div>
              <input class="armor-select" data-slot="torso" placeholder="Armor piece" />
              <div class="armor-stats">
                <div>Armor Value: <span class="stat av">-</span></div>
                <div>Reduction: <span class="stat red">-</span></div>
                <div>Durability: <span class="stat dur">-</span></div>
                <div>Injury: <input type="checkbox" class="armor-injury" data-slot="torso" /></div>
              </div>
            </div>

            <div class="armor-avatar-wrap">
              <img src="/blightsend/assets/armor-avatar.png" alt="Avatar" class="armor-avatar">
            </div>

            <div class="armor-section" data-slot="r_arm" data-grid="r_arm">
              <div class="armor-slot-title">R. Arm</div>
              <input class="armor-select" data-slot="r_arm" placeholder="Armor piece" />
              <div class="armor-stats">
                <div>Armor Value: <span class="stat av">-</span></div>
                <div>Reduction: <span class="stat red">-</span></div>
                <div>Durability: <span class="stat dur">-</span></div>
                <div>Injury: <input type="checkbox" class="armor-injury" data-slot="r_arm" /></div>
              </div>
            </div>

            <div class="armor-section" data-slot="l_arm" data-grid="l_arm">
              <div class="armor-slot-title">L. Arm</div>
              <input class="armor-select" data-slot="l_arm" placeholder="Armor piece" />
              <div class="armor-stats">
                <div>Armor Value: <span class="stat av">-</span></div>
                <div>Reduction: <span class="stat red">-</span></div>
                <div>Durability: <span class="stat dur">-</span></div>
                <div>Injury: <input type="checkbox" class="armor-injury" data-slot="l_arm" /></div>
              </div>
            </div>

            <div class="armor-section" data-slot="r_leg" data-grid="r_leg">
              <div class="armor-slot-title">R. Leg</div>
              <input class="armor-select" data-slot="r_leg" placeholder="Armor piece" />
              <div class="armor-stats">
                <div>Armor Value: <span class="stat av">-</span></div>
                <div>Reduction: <span class="stat red">-</span></div>
                <div>Durability: <span class="stat dur">-</span></div>
                <div>Injury: <input type="checkbox" class="armor-injury" data-slot="r_leg" /></div>
              </div>
            </div>

            <div class="armor-section" data-slot="l_leg" data-grid="l_leg">
              <div class="armor-slot-title">L. Leg</div>
              <input class="armor-select" data-slot="l_leg" placeholder="Armor piece" />
              <div class="armor-stats">
                <div>Armor Value: <span class="stat av">-</span></div>
                <div>Reduction: <span class="stat red">-</span></div>
                <div>Durability: <span class="stat dur">-</span></div>
                <div>Injury: <input type="checkbox" class="armor-injury" data-slot="l_leg" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(armorOverlay);

    // Bind open/close
    const armorBtn = $("#cs_btn_armor");
    const armorClose = $("#armorCloseBtn");
    if (armorBtn && !armorBtn.dataset.bound) {
      armorBtn.dataset.bound = '1';
      armorBtn.disabled = false; // enable the button
      armorBtn.addEventListener('click', () => {
        armorOverlay.classList.add('show');
        armorOverlay.setAttribute('aria-hidden','false');
      });
    }
    if (armorClose) {
      armorClose.addEventListener('click', () => {
        armorOverlay.classList.remove('show');
        armorOverlay.setAttribute('aria-hidden','true');
      });
    }
    // Simple autocomplete/suggestion behavior for armor selects
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'armor-suggestions';
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.zIndex = 1300;
    suggestionBox.style.background = 'rgba(10,10,10,0.98)';
    suggestionBox.style.border = '1px solid rgba(255,255,255,0.06)';
    suggestionBox.style.display = 'none';
    suggestionBox.style.maxHeight = '200px';
    suggestionBox.style.overflow = 'auto';
    suggestionBox.style.width = '240px';
    document.body.appendChild(suggestionBox);

    const slotMap = { head: ['head'], torso: ['torso'], r_arm: ['arms','arm'], l_arm: ['arms','arm'], r_leg: ['legs','leg'], l_leg: ['legs','leg'] };

    function findMatchesForSlot(slot, q) {
      const keywords = slotMap[slot] || [slot];
      const term = (q || '').toLowerCase();
      return armorData.filter(a => {
        const loc = (a.location || '').toLowerCase();
        const ok = keywords.some(k => loc.includes(k));
        if (!ok) return false;
        if (!term) return true;
        return a.name.toLowerCase().includes(term);
      });
    }

    function showSuggestions(inputEl, slot) {
      const rect = inputEl.getBoundingClientRect();
      suggestionBox.style.left = rect.left + 'px';
      suggestionBox.style.top = rect.bottom + 'px';
      suggestionBox.style.width = Math.max(200, rect.width) + 'px';
      suggestionBox.innerHTML = '';
      const matches = findMatchesForSlot(slot, inputEl.value).slice(0, 20);
      if (!matches.length) {
        suggestionBox.style.display = 'none';
        return;
      }
      matches.forEach(m => {
        const row = document.createElement('div');
        row.className = 'armor-suggestion-row';
        row.textContent = m.name;
        row.style.padding = '0.4rem 0.6rem';
        row.style.cursor = 'pointer';
        row.style.borderBottom = '1px solid rgba(255,255,255,0.02)';
        row.addEventListener('click', () => {
          inputEl.value = m.name;
          populateArmorStatsForSlot(slot, m);
          suggestionBox.style.display = 'none';
        });
        suggestionBox.appendChild(row);
      });
      suggestionBox.style.display = 'block';
    }

    function populateArmorStatsForSlot(slot, armor) {
      const section = document.querySelector(`.armor-section[data-slot="${slot}"]`);
      if (!section) return;
      const av = section.querySelector('.stat.av');
      const red = section.querySelector('.stat.red');
      const dur = section.querySelector('.stat.dur');
      av.textContent = armor.armorValue != null ? String(armor.armorValue) : '-';
      red.textContent = armor.reduction != null ? String(armor.reduction) : '-';
      dur.textContent = armor.durability != null ? String(armor.durability) : '-';
      // mark the input's dataset
      const input = section.querySelector('.armor-select');
      if (input) input.dataset.selected = armor.name;
    }

    // Attach listeners to inputs
    $all('.armor-select').forEach((inp) => {
      const slot = inp.dataset.slot;
      inp.addEventListener('input', (e) => {
        showSuggestions(e.target, slot);
      });
      inp.addEventListener('focus', (e) => {
        showSuggestions(e.target, slot);
      });
      inp.addEventListener('blur', () => {
        setTimeout(() => { suggestionBox.style.display = 'none'; }, 150);
      });
    });
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
  if (!homeScreen || !sheetScreen || !compendiumRoot) return;

  homeScreen.classList.toggle("be-hidden", view !== "home");
  sheetScreen.classList.toggle("be-hidden", view !== "sheet");
  compendiumRoot.classList.toggle("be-hidden", view !== "compendium");

  // close modal overlays when switching
  toggleSheetMenu(false);

  // Optional: when we enter compendium, make sure it has rendered once.
  if (view === "compendium") {
    initCompendiumOnce();
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
  hp_max: getNum("cs_hp_max"),
    stamina: getNum("cs_stamina"),
    ephem: getNum("cs_ephem"),
    walk: getNum("cs_walk"),
    run: getNum("cs_run"),
    fight: getNum("cs_fight"),
    volley: getNum("cs_volley"),
    guts: getNum("cs_guts"),
    grit: getNum("cs_grit"),
    focus: getNum("cs_focus"),
    coins: getNum("cs_coins"),
    armor: (function() {
      const slots = ['head','torso','r_arm','l_arm','r_leg','l_leg'];
      const out = {};
      slots.forEach(s => {
        const section = document.querySelector(`.armor-section[data-slot="${s}"]`);
        if (!section) return;
        const name = (section.querySelector('.armor-select')||{}).value || '';
        const av = (section.querySelector('.stat.av')||{}).textContent || '-';
        const red = (section.querySelector('.stat.red')||{}).textContent || '-';
        const dur = (section.querySelector('.stat.dur')||{}).textContent || '-';
        const inj = !!(section.querySelector('.armor-injury') && section.querySelector('.armor-injury').checked);
        out[s] = { name: name, armorValue: av === '-' ? null : Number(av), reduction: red === '-' ? null : Number(red), durability: dur === '-' ? null : Number(dur), injury: inj };
      });
      return out;
    })(),
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
  setNum("cs_hp_max", state.hp_max);
  setNum("cs_stamina", state.stamina);
  setNum("cs_ephem", state.ephem);
  setNum("cs_walk", state.walk);
  setNum("cs_run", state.run);
  setNum("cs_fight", state.fight);
  setNum("cs_volley", state.volley);
  setNum("cs_guts", state.guts);
  setNum("cs_grit", state.grit);
  setNum("cs_focus", state.focus);
  setNum("cs_coins", state.coins);

  // Load armor slots if present
  if (state.armor) {
    Object.keys(state.armor).forEach((slot) => {
      const data = state.armor[slot];
      const section = document.querySelector(`.armor-section[data-slot="${slot}"]`);
      if (!section) return;
      const inp = section.querySelector('.armor-select');
      if (inp && data && data.name) {
        inp.value = data.name;
        inp.dataset.selected = data.name;
      }
      const av = section.querySelector('.stat.av');
      const red = section.querySelector('.stat.red');
      const dur = section.querySelector('.stat.dur');
      if (av) av.textContent = data && data.armorValue != null ? String(data.armorValue) : '-';
      if (red) red.textContent = data && data.reduction != null ? String(data.reduction) : '-';
      if (dur) dur.textContent = data && data.durability != null ? String(data.durability) : '-';
      const inj = section.querySelector('.armor-injury');
      if (inj) inj.checked = !!(data && data.injury);
    });
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
    filterLabel: "Layer",
    chipOptions: ["All", "Base", "Mid", "Flexible Outer", "Rigid Outer"]
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
      // Prefer explicit `layer` field; fall back to `armorClass` for legacy entries.
      const layerVal = item.layer || item.armorClass || "";
      return normalize(layerVal) === normalize(currentFilter);
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

  config.chipOptions.forEach((label) => {
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

    // For armor we want the location shown next to the title (e.g. "Padded Coif - Head")
    let displayName = item.name || "";
    if (currentPage === "weapons" && item.type) {
      displayName = `${item.name} - ${item.type}`;
    }
    if (currentPage === "armor") {
      displayName = item.name + (item.location ? ` - ${item.location}` : "");
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
      // Quick-list layout per request:
      // Title: "Name - Location"
      // Under title (meta): first line shows AV · AR · DUR
      // second line shows RES and Weight
      const av = item.armorValue != null ? `AV ${item.armorValue}` : "AV -";
      const ar = item.reduction != null ? `AR ${item.reduction}` : "AR -";
      const dur = item.durability != null ? `Dur ${item.durability}` : "Dur -";
      const res = item.resistance ? `Res ${item.resistance}` : "Res -";
      const wt = item.weight != null ? `Wt ${item.weight}` : "Wt -";
      meta.innerHTML = `<div class="meta-top">${av} · ${ar} · ${dur}</div><div class="meta-bottom">${res} · ${wt}</div>`;
    } else if (currentPage === "conditions") {
      meta.textContent = "Condition";
    }

    const tagline = document.createElement("div");
    tagline.className = "item-tagline";
    tagline.textContent = item.summary || item.description || item.effect || "";

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
    // Show compact pills for key stats
    if (item.armorValue != null) modalPills.appendChild(makePill("AV: " + item.armorValue));
    if (item.reduction != null) modalPills.appendChild(makePill("AR: " + item.reduction));
    if (item.durability != null) modalPills.appendChild(makePill("Dur: " + item.durability));
    if (item.layer) modalPills.appendChild(makePill(item.layer));
    if (item.weight != null) modalPills.appendChild(makePill("Wt: " + item.weight));
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
    // Build a more stylized detail view for armor
    const av = item.armorValue != null ? item.armorValue : "-";
    const ar = item.reduction != null ? item.reduction : "-";
    const dur = item.durability != null ? item.durability : "-";
    const res = item.resistance || "-";
    const loc = item.location || "-";
    const layer = item.layer || item.armorClass || "-";
    const wt = item.weight != null ? item.weight : "-";
    const cost = item.cost != null ? item.cost : "-";

    const detailsHTML = `
      <div class="armor-detail-grid">
        <div class="armor-detail-left">
          <div class="armor-stat-row"><span class="stat-label">Armor Value</span><span class="stat-value">${av}</span></div>
          <div class="armor-stat-row"><span class="stat-label">Reduction</span><span class="stat-value">${ar}</span></div>
          <div class="armor-stat-row"><span class="stat-label">Durability</span><span class="stat-value">${dur}</span></div>
          <div class="armor-stat-row"><span class="stat-label">Layer</span><span class="stat-value">${layer}</span></div>
        </div>
        <div class="armor-detail-right">
          <div class="armor-meta-row"><strong>Location</strong><div>${loc}</div></div>
          <div class="armor-meta-row"><strong>Resistance</strong><div>${res}</div></div>
          <div class="armor-meta-row"><strong>Weight</strong><div>${wt}</div></div>
          <div class="armor-meta-row"><strong>Cost</strong><div>${cost}</div></div>
        </div>
      </div>
    `;

    bodyParts.push(detailsHTML);
    if (item.notes) bodyParts.push(`<div class="modal-section-title">Notes</div><p>${item.notes}</p>`);
  }

  modalBody.innerHTML = bodyParts.join("");
  modalBackdrop.classList.add("show");
}

function initCompendiumOnce() {
  if (compendiumInitialized) return;
  compendiumInitialized = true;

  // Wire compendium events (only if the elements exist)
  initModalRefs();

  const topNav = $("#topNav");
  const chipRow = $("#chipRow");
  const searchInput = $("#searchInput");
  const listContainer = $("#listContainer");

  // Back button (in-case compendium header has it)
  const compBackBtn = $("#compBackBtn");
  if (compBackBtn && !compBackBtn.dataset.bound) {
    compBackBtn.dataset.bound = "1";
    compBackBtn.addEventListener('click', () => navigate('home'));
  }

  if (!topNav || !chipRow || !searchInput || !listContainer) {
    console.warn("Compendium UI elements not found. If you changed index.html structure, tell me.");
    return;
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
