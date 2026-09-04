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

        routes.MapPost("/{n:int}/itens", async (int n, Guid prodId, int quantidade, AppDbContext db) =>
        {
            var nota = await db.Notas.Include(nt => nt.Itens).FirstOrDefaultAsync(nt => nt.N == n);
            if (nota is null)
                return Results.NotFound("Nota não encontrada");
            
            var produto = await db.Produtos.FindAsync(prodId);
            if (produto is null)
                return Results.NotFound("Produto não encontrado");

            try
            {
                produto.BaixarEstoque(quantidade);
                nota.AdicionarProd(prodId, quantidade);
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