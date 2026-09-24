# Mercado — Front-end (Angular 18)

Front-end standalone (sem NgModules) para a API `Mercado` (ASP.NET Minimal API + EF Core).

## Como rodar

```bash
npm install
npm start
```

A aplicação sobe em `http://localhost:4200` e chama a API em `http://localhost:5145`
(porta definida em `src/environments/environment.development.ts`, mesma usada no `Mercado.http`).

## Sobre as rotas da API

O `Program.cs` enviado só expõe `MapProdutoRoutes()` e `MapNotaRoutes()` como extension methods —
não veio o conteúdo dessas classes. Os serviços abaixo foram escritos assumindo rotas REST
convencionais; ajuste os caminhos se as suas forem diferentes (estão comentados no topo de cada arquivo):

- `src/app/core/services/produto.service.ts` → `GET/POST/PUT/DELETE /produtos`
- `src/app/core/services/nota.service.ts` → `GET/POST /notas`, `PUT /notas/{n}/fechar`,
  `POST /notas/{n}/itens`, `DELETE /notas/{n}/itens/{itemId}`

Os nomes dos campos (`produto`, `descricao`, `quantidade`, `n`, `status`, `prodId`, `notaId`)
seguem o schema real do `mercado.sqlite` enviado, em camelCase (padrão do `System.Text.Json`
no ASP.NET Core).

## Estrutura

```
src/app/
├── core/            # models + services (HTTP, estado com Angular signals)
├── features/
│   ├── produtos/    # listagem em cards + formulário de cadastro/edição
│   └── notas/       # ledger de notas + detalhe expansível (itens, fechar nota)
└── shared/          # empty-state e toast reutilizáveis
```

## Design

Identidade visual de "caderno de feira": verde-mato como cor estrutural (navegação e ledger),
mostarda como único acento de ação, tijolo reservado para alertas/fechamento. Cards de produto
têm corte diagonal + furo, lembrando etiqueta de preço; notas aparecem como um livro-caixa com
linhas expansíveis. Totalmente responsivo: barra lateral vira navegação inferior abaixo de 780px.
