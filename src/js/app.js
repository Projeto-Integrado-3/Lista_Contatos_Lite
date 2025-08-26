import { Contact } from './models/Contact.js';
import { loadContacts, saveContacts, clearContacts } from './storage.js';

// Estado em memória
let contacts = loadContacts().map(c => Contact.fromJSON(c));

// Adicionar contato padrão se a lista estiver vazia
if (contacts.length === 0) {
  const defaultContact = {
    name: 'VALDEILSON BEZERRA DE LIMA',
    email: 'valdeilsonbdl56@gmail.com',
    phone: '83991967945'
  };
  try {
    const contact = new Contact(defaultContact);
    contacts.push(contact);
    persist(); // Salva o contato inicial
  } catch (e) {
    console.error("Erro ao adicionar contato padrão:", e);
  }
}

// Seletores
const form = document.getElementById('contact-form');
const listEl = document.getElementById('contact-list');
const emptyMessageEl = document.getElementById('empty-message');
const searchInput = document.getElementById('search');
const exportBtn = document.getElementById('export-json');
const clearAllBtn = document.getElementById('clear-all');

// UTIL
function showError(inputName, msg) {
  const small = document.querySelector(`[data-error-for="${inputName}"]`);
  if (small) small.textContent = msg || '';
}
function clearErrors() {
  document.querySelectorAll('.error[data-error-for]').forEach(el => el.textContent = '');
}

function render(filterTerm = '') {
  listEl.innerHTML = '';
  const term = filterTerm.trim().toLowerCase();
  const filtered = term ? contacts.filter(c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)) : contacts;

  if (filtered.length === 0) {
    emptyMessageEl.classList.remove('hidden');
  } else {
    emptyMessageEl.classList.add('hidden');
  }

  filtered.forEach(contact => {
    const li = document.createElement('li');
    li.className = 'contact-item fade-enter';
    li.dataset.id = contact.id;
    li.innerHTML = `
      <strong title="Nome">${contact.name}</strong>
      <span class="email" title="E-mail">${contact.email}</span>
      <span class="phone" title="Telefone">${contact.phone}</span>
      <div class="actions-inline">
        <button data-action="remove" title="Remover" class="danger">Remover</button>
      </div>`;
    listEl.appendChild(li);
  });
}

function addContact(data) {
  try {
    // Evitar duplicados simples (mesmo e-mail)
    if (contacts.some(c => c.email === data.email.trim().toLowerCase())) {
      showError('email', 'E-mail já cadastrado');
      return false;
    }
    const contact = new Contact(data);
    contacts.push(contact);
    persist();
    render(searchInput.value);
    return true;
  } catch (e) {
    const msg = e.message || 'Dados inválidos';
    if (/nome/i.test(msg)) showError('name', msg); else if (/mail/i.test(msg)) showError('email', msg); else showError('phone', msg);
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
    return false;
  }
}

function removeContact(id) {
  contacts = contacts.filter(c => c.id !== id);
  persist();
  render(searchInput.value);
}

function persist() {
  saveContacts(contacts.map(c => c.toJSON()));
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(contacts.map(c => c.toJSON()), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contatos.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  const formData = new FormData(form);
  const added = addContact({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone')
  });
  if (added) form.reset();
});

form.addEventListener('reset', () => {
  clearErrors();
});

listEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action="remove"]');
  if (btn) {
    const li = btn.closest('li');
    if (li) removeContact(li.dataset.id);
  }
});

searchInput.addEventListener('input', () => {
  render(searchInput.value);
});

exportBtn.addEventListener('click', exportJSON);

clearAllBtn.addEventListener('click', () => {
  if (contacts.length === 0) return;
  if (confirm('Remover todos os contatos?')) {
    contacts = [];
    clearContacts();
    render(searchInput.value);
  }
});

// Inicialização
render();
