# Mercado

Cadastro de produtos e notas fiscais. API em C#/.NET + front-end em Angular.

## Stack

- **Back-end**: .NET 10, ASP.NET Minimal API, EF Core (SQLite)
- **Front-end**: Angular 18 (standalone), TypeScript

## Estrutura

```
Mercado/                 # API (.NET)
├── Data/                # AppDbContext
├── Models/              # NotaModel, ItemNotaModel, ProdutoModel
├── Routes/               # MapProdutoRoutes, MapNotaRoutes
└── Program.cs

mercado-frontend/        # Front-end (Angular)
└── src/app/
    ├── core/            # models e services
    ├── features/        # produtos e notas
    └── shared/          # empty-state, toast
```

## Domínio

- **Produto**: `id`, `produto`, `descricao`, `quantidade` (estoque)
- **Nota**: `n` (numeração sequencial), `status` (`Aberta`/`Fechada`), lista de itens
- **ItemNota**: `id`, `notaId`, `prodId`, `quantidade`
