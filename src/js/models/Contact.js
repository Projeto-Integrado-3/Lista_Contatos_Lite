export class Contact {
  #name;
  #email;
  #phone;
  #id;

  constructor({ name, email, phone }) {
    this.name = name; // via setter
    this.email = email;
    this.phone = phone;
    this.#id = crypto.randomUUID();
  }

  // Getters
  get id() { return this.#id; }
  get name() { return this.#name; }
  get email() { return this.#email; }
  get phone() { return this.#phone; }

  // Setters com validações simples
  set name(value) {
    const v = (value || '').trim();
    if (!v) throw new Error('Nome é obrigatório');
    if (v.length < 2) throw new Error('Nome muito curto');
    this.#name = v;
  }
  set email(value) {
    const v = (value || '').trim();
    // Regex simples (não perfeita) para validação básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(v)) throw new Error('E-mail inválido');
    this.#email = v.toLowerCase();
  }
  set phone(value) {
    const v = (value || '').trim();
    // Aceita dígitos, espaços, parênteses, hifens e +. 8-20 chars após limpeza
    const digits = v.replace(/[^0-9]/g, '');
    if (digits.length < 8) throw new Error('Telefone inválido');
    this.#phone = v;
  }

  toJSON() {
    return { id: this.#id, name: this.#name, email: this.#email, phone: this.#phone };
  }

  static fromJSON(obj) {
    const c = new Contact({ name: obj.name, email: obj.email, phone: obj.phone });
    c.#id = obj.id; // preservar id
    return c;
  }
}
