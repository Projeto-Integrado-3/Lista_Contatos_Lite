import { Contact } from './models/Contact.js';
import { loadContacts, saveContacts, clearContacts } from './storage.js';

// Estado em memória
let contacts = loadContacts().map(c => Contact.fromJSON(c));
let editingId = null; // id do contato atualmente em edição

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
const submitBtn = form.querySelector('button[type="submit"]');
const resetBtn = form.querySelector('button[type="reset"]');
const formTitleEl = form.closest('section').querySelector('h2');

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
  <button data-action="edit" title="Editar" class="secondary">Editar</button>
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

function updateContact(id, data) {
  const contact = contacts.find(c => c.id === id);
  if (!contact) return false;

  // Verificar duplicidade de e-mail ignorando o próprio contato
  const newEmail = (data.email || '').trim().toLowerCase();
  if (contacts.some(c => c.email === newEmail && c.id !== id)) {
    showError('email', 'E-mail já cadastrado');
    return false;
  }

  const old = { name: contact.name, email: contact.email, phone: contact.phone };
  try {
    contact.name = data.name;
    contact.email = data.email;
    contact.phone = data.phone;
    persist();
    render(searchInput.value);
    return true;
  } catch (e) {
    // Restaurar em caso de falha
    contact.name = old.name;
    contact.email = old.email;
    contact.phone = old.phone;
    const msg = e.message || 'Dados inválidos';
    if (/nome/i.test(msg)) showError('name', msg); else if (/mail/i.test(msg)) showError('email', msg); else showError('phone', msg);
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
    return false;
  }
}

function setEditMode(contact) {
  editingId = contact.id;
  formTitleEl.textContent = 'Editar Contato';
  submitBtn.textContent = 'Salvar';
  resetBtn.textContent = 'Cancelar';
  form.name.value = contact.name;
  form.email.value = contact.email;
  form.phone.value = contact.phone;
  form.name.focus();
}

function clearEditMode() {
  editingId = null;
  formTitleEl.textContent = 'Novo Contato';
  submitBtn.textContent = 'Adicionar';
  resetBtn.textContent = 'Limpar';
  form.reset();
  clearErrors();
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
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone')
  };
  if (editingId) {
    const ok = updateContact(editingId, payload);
    if (ok) clearEditMode();
  } else {
    const added = addContact(payload);
    if (added) form.reset();
  }
});

form.addEventListener('reset', () => {
  // Se estava editando, cancelar modo edição; senão apenas limpar erros
  if (editingId) {
    setTimeout(() => { // atraso para não conflitar com evento default
      clearEditMode();
    }, 0);
  } else {
    clearErrors();
  }
});

listEl.addEventListener('click', (e) => {
  const actionBtn = e.target.closest('button[data-action]');
  if (!actionBtn) return;
  const li = actionBtn.closest('li');
  if (!li) return;
  const id = li.dataset.id;
  if (actionBtn.dataset.action === 'remove') {
    removeContact(id);
  } else if (actionBtn.dataset.action === 'edit') {
    const contact = contacts.find(c => c.id === id);
    if (contact) setEditMode(contact);
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
