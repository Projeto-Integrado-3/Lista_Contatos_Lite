# Lista de Contatos Lite

Projeto básico para disciplina de Programação para Web (ADS / UFCA 2025.1).

## Objetivo
Página web simples para cadastrar, listar, filtrar e remover contatos (nome, e-mail e telefone) com persistência em `localStorage`.

## Funcionalidades
- Adicionar contato com validação mínima (classe `Contact` com getters/setters).
- Remover contato individual.
- Remover todos os contatos.
- Filtro (busca) por nome ou e-mail em tempo real.
- Prevenção de cadastro duplicado por e-mail.
- Exportar contatos em arquivo JSON.
- Persistência automática em `localStorage`.

## Estrutura
```
index.html
src/
	css/styles.css
	js/
		app.js
		storage.js
		models/Contact.js
```

## Como usar
1. Abra o arquivo `index.html` em um navegador moderno (suporta módulos ES e `crypto.randomUUID`).
2. Cadastre contatos pelo formulário.
3. Utilize o campo de busca para filtrar.
4. Use os botões de "Remover" para excluir ou "Limpar Tudo" para apagar todos.
5. Clique em "Exportar" para baixar um `.json` com os dados.

## Validações
- Nome: obrigatório, mínimo 2 caracteres.
- E-mail: formato básico válido e único na lista.
- Telefone: mínimo 8 dígitos (aceita formatação livre com parênteses, espaços, hífens, +).

## Próximos Passos (Sugestões)
- Edição de contato.
- Ordenação por nome.
- Máscara de telefone.
- Testes automatizados (Playwright / Vitest + JSDOM).

## Equipe

| Nome | Matrícula |
|------|-----------|
| Marcondes Alves Duarte | 0000000 |
| Rayane Amaro dos Santos | 2023010280 |
| Valdeilson Bezerra de Lima | 0000000 |

## Licença
MIT. Consulte `LICENSE`.