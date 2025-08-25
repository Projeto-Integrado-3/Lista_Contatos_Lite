const STORAGE_KEY = 'contact_list_lite:v1';

export function loadContacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (e) {
    console.warn('Falha ao carregar contatos', e);
    return [];
  }
}

export function saveContacts(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Falha ao salvar contatos', e);
  }
}

export function clearContacts() {
  localStorage.removeItem(STORAGE_KEY);
}
