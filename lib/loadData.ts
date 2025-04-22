// lib/loadData.ts
export async function loadSiteData() {
  let data;
  try {
    const res = await fetch('/content/site.json');
    if (!res.ok) throw new Error('Failed to fetch site data');
    data = await res.json();
  } catch (error) {
    console.error('Error loading site data:', error);
    return {
      meta: {
        title: 'Default Site Title',
        description: 'Default site description',
        keywords: 'default, keywords',
      }
    };
  }
  return data;
}

export async function loadContactsData() {
  try {
    const res = await fetch('/content/contacts/contacts.json');
    if (!res.ok) throw new Error('Failed to fetch contacts data');
    return await res.json();
  } catch (error) {
    console.error('Error loading contacts data:', error);
    return null;
  }
}

export async function loadHeaderData() {
  try {
    const res = await fetch('/content/header/header.json');
    if (!res.ok) throw new Error('Failed to fetch header data');
    return await res.json();
  } catch (error) {
    console.error('Error loading header data:', error);
    return null;
  }
}

export async function loadFooterData() {
  try {
    const res = await fetch('/content/footer/footer.json');
    if (!res.ok) throw new Error('Failed to fetch footer data');
    return await res.json();
  } catch (error) {
    console.error('Error loading footer data:', error);
    return null;
  }
}