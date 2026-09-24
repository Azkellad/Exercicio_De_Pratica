using Mercado.Data;
using Mercado.Models;
using Microsoft.EntityFrameworkCore;
namespace Mercado.Routes;

public static class NotaRoutes
{
    public static WebApplication MapNotaRoutes(this WebApplication app)
    {
        var routes = app.MapGroup("/nota");

        routes.MapGet("/", async (AppDbContext db) =>
            await db.Notas.Include(nt => nt.Itens).AsNoTracking().ToListAsync());
        
        routes.MapGet("/{n:int}", async (int n, AppDbContext db) =>
            await db.Notas.Include(nt => nt.Itens).FirstOrDefaultAsync(nt => nt.N == n)
            is {} nota? Results.Ok(nota) : Results.NotFound());
        
        routes.MapPost("/", async (AppDbContext db) =>
        {
            var nota = new NotaModel();
            db.Notas.Add(nota);
            await db.SaveChangesAsync();
            return Results.Created($"/nota/{nota.N}", nota);
        });

        routes.MapPost("/comprar", async (CompraRequest request, AppDbContext db) =>
        {
            if (request.Itens is null || request.Itens.Count == 0)
                return Results.BadRequest("A compra deve conter pelo menos um produto.");

            await using var transaction = await db.Database.BeginTransactionAsync();
            var nota = new NotaModel();
            db.Notas.Add(nota);

            try
            {
                foreach (var item in request.Itens)
                {
                    var produto = await db.Produtos.FindAsync(item.ProdId);
                    if (produto is null)
                        return Results.NotFound($"Produto {item.ProdId} não encontrado.");

                    produto.BaixarEstoque(item.Quantidade);
                    nota.AdicionarProd(item.ProdId, item.Quantidade);
                }

                nota.Fechar();
                await db.SaveChangesAsync();
                await transaction.CommitAsync();
                return Results.Ok(nota);
            }
            catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
            {
                await transaction.RollbackAsync();
                return Results.BadRequest(ex.Message);
            }
        });

        routes.MapPost("/{n:int}/itens", async (int n, ItemNotaRequest request, AppDbContext db) =>
        {
            var nota = await db.Notas.Include(nt => nt.Itens).FirstOrDefaultAsync(nt => nt.N == n);
            if (nota is null)
                return Results.NotFound("Nota não encontrada");
            
            var produto = await db.Produtos.FindAsync(request.ProdId);
            if (produto is null)
                return Results.NotFound("Produto não encontrado");

            try
            {
                produto.BaixarEstoque(request.Quantidade);
                nota.AdicionarProd(request.ProdId, request.Quantidade);
            }

            catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
            {
                return Results.BadRequest(ex.Message);
            }
            
            await db.SaveChangesAsync();
            return Results.Ok(nota);
        });
        
        routes.MapPost("/{n:int}/fechar", async (int n, AppDbContext db) =>
        {
            var nota = await db.Notas.Include(nt=> nt.Itens).FirstOrDefaultAsync(nt => nt.N == n);
            if (nota is null)
                return Results.NotFound("Nota não encontrada");
            
            nota.Fechar();
            await db.SaveChangesAsync();
            return Results.Ok(nota);
        });
        return app;
    }
}

public sealed record CompraRequest(IReadOnlyList<ItemCompraRequest> Itens);

public sealed record ItemCompraRequest(Guid ProdId, int Quantidade);

public sealed record ItemNotaRequest(Guid ProdId, int Quantidade);