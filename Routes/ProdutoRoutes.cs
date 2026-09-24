using Mercado.Data;
using Mercado.Models;
using Microsoft.EntityFrameworkCore;

namespace Mercado.Routes;

public static class ProdutoRoutes
{
    public static WebApplication MapProdutoRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/produtos");

        group.MapGet("/", async (AppDbContext db) =>
            await db.Produtos.AsNoTracking().ToListAsync());

        group.MapGet("/{id:Guid}", async (Guid id, AppDbContext db) =>
            await db.Produtos.FindAsync(id) is { } produto
                ? Results.Ok(produto)
                : Results.NotFound());

        group.MapPost("/", async (ProdutoModel produto, AppDbContext db) =>
        {
            db.Produtos.Add(produto);
            await db.SaveChangesAsync();
            return Results.Created($"/produtos/{produto.Id}", produto);
        });

        group.MapPut("/{id:Guid}", async (Guid id, ProdutoUpdateRequest request, AppDbContext db) =>
        {
            var produto = await db.Produtos.FindAsync(id);
            if (produto is null) return Results.NotFound();

            produto.AtualizarProduto(request.Produto, request.Descricao, request.Quantidade);
            await db.SaveChangesAsync();
            return Results.Ok(produto);
        });

        group.MapPut("/{id:Guid}/estoque", async (Guid id, int quantidade, string operacao, AppDbContext db) =>
        {
            var produto = await db.Produtos.FindAsync(id);
            if (produto is null) return Results.NotFound();

            if (operacao == "adicionar") produto.AdicionarEstoque(quantidade);
            else if (operacao == "baixar") produto.BaixarEstoque(quantidade);
            else return Results.BadRequest("Operação inválida. Use 'adicionar' ou 'baixar'.");

            await db.SaveChangesAsync();
            return Results.Ok(produto);
        });

        return app;
    }
}

public sealed record ProdutoUpdateRequest(string Produto, int Quantidade, string Descricao);