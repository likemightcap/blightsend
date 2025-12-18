
export async function loadAllData() {
  function getSiteRoot() {
    const path = window.location.pathname;
    const match = path.match(/^\/(.+?)\//);
    return match ? `/${match[1]}/` : '/';
  }
  const siteRoot = getSiteRoot();
  const fetches = await Promise.all([
    fetch(siteRoot + 'data/echoes.json'),
    fetch(siteRoot + 'data/weapons.json'),
    fetch(siteRoot + 'data/skills.json'),
    fetch(siteRoot + 'data/armor.json'),
    fetch(siteRoot + 'data/conditions.json')
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
