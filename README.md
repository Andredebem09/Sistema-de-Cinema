# CineWeb - Frontend (React + TypeScript)

Este projeto implementa o módulo administrativo do sistema **CineWeb**, com CRUD completo para:

- Filmes
- Salas
- Sessões
- Ingressos (venda de ingressos por sessão)
- Escolha opcional de **combo de pipoca** na venda do ingresso

Stack utilizada (conforme enunciado):

- React + Vite (TypeScript)
- React Router DOM
- Bootstrap + Bootstrap Icons
- Zod para validação de formulários
- Json-Server simulando a API REST (porta 3000)

## Como executar

1. Instalar dependências:

```bash
npm install
```

2. Subir o backend simulado (JSON Server):

```bash
npm run backend
```

Isso vai usar o arquivo **db.json** na raiz do projeto e rodar em `http://localhost:3000`.

3. Em outro terminal, subir o frontend:

```bash
npm run dev
```

Abra o navegador na URL que o Vite indicar (por padrão `http://localhost:5173`).

## Rotas principais

- `/` – Tela inicial
- `/filmes` – CRUD de filmes
- `/salas` – CRUD de salas
- `/sessoes` – CRUD de sessões + botão **Vender Ingresso**
- `/ingressos` – Listagem e exclusão de ingressos vendidos

Ao clicar em **Vender Ingresso** em uma sessão, o sistema abre uma tela onde é possível:

- Escolher se o ingresso é **INTEIRA** ou **MEIA**;
- Selecionar opcionalmente um ou mais **combos de pipoca**;
- Calcular automaticamente o **valor total** (ingresso + combos);
- Salvar a venda na coleção `ingressos` do `db.json`.
