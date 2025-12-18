export async function loadAllData(base = './data/') {
  const fetches = await Promise.all([
    fetch(base + 'echoes.json'),
    fetch(base + 'weapons.json'),
    fetch(base + 'skills.json'),
    fetch(base + 'armor.json'),
    fetch(base + 'conditions.json')
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
