export async function loadAllData() {
  const fetches = await Promise.all([
    fetch('./data/echoes.json'),
    fetch('./data/weapons.json'),
    fetch('./data/skills.json'),
    fetch('./data/armor.json'),
    fetch('./data/conditions.json')
  ]);

  const safeJson = async (res) => {
    try {
      if (res && res.ok) return await res.json();
    } catch (e) {}
    return [];
  };

  return {
    echoes: await safeJson(fetches[0]),
    weapons: await safeJson(fetches[1]),
    skills: await safeJson(fetches[2]),
    armor: await safeJson(fetches[3]),
    conditions: await safeJson(fetches[4])
  };
}
