# Lista de Contatos Lite

Projeto para disciplina de Programação para Web - Curso de Análise e Desenvolvimento de Sistemas da Universidade Federal do Cariri (UFCA)

## 📋 Sobre o Projeto
Aplicação web para gerenciamento de contatos pessoais que permite cadastrar, listar, filtrar e remover contatos. Implementa validações de dados, busca em tempo real e persistência utilizando localStorage.

## 👨‍💻 Equipe de Desenvolvimento

| Nome | Matrícula |
|------|-----------|
| Marcondes Alves Duarte | 0000000 |
| Rayane Amaro dos Santos | 2023010280 |
| Valdeilson Bezerra de Lima | 2023010306|

## ✨ Funcionalidades
- Cadastro de contatos com validação de dados
- Busca em tempo real por nome ou e-mail
- Remoção individual ou em lote de contatos
- Persistência automática no localStorage
- Exportação de dados em formato JSON
- Prevenção de contatos duplicados

## 🛠️ Tecnologias Utilizadas
- HTML5 - Estrutura da página
- CSS3 - Estilização e responsividade
- JavaScript (ES6+) - Lógica e interatividade
- LocalStorage - Armazenamento de dados


## 📂 Estrutura do Projeto
```
index.html              # Interface principal
src/
    css/styles.css      # Estilização CSS
    js/
        app.js          # Lógica principal
        storage.js      # Persistência
        models/Contact.js # Modelo de dados
```

## 🚀 Como Usar
1. Abra o arquivo `index.html` em um navegador
2. Preencha o formulário para adicionar contatos
3. Use a busca para filtrar contatos
4. Clique em "Remover" para excluir um contato
5. Use "Exportar" para baixar os dados em JSON

## ✅ Validações
- Nome: obrigatório, mínimo 2 caracteres
- E-mail: formato válido e único na lista
- Telefone: mínimo 8 dígitos, aceita vários formatos

## 🧠 Conceitos Aplicados
- Manipulação do DOM
- Eventos de formulário
- Validação de dados
- Armazenamento no localStorage
- Classes com getters/setters
- Módulos JavaScript

## 📊 Requisitos Atendidos
- [x] Eventos de formulário para cadastro/remoção
- [x] Organização da lógica em funções
- [x] Representação de dados com classes e getters/setters
- [x] Validação de dados nos setters
- [x] Persistência utilizando localStorage e JSON

## 📜 Licença
MIT. Consulte o arquivo `LICENSE` para mais detalhes.
