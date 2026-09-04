using Microsoft.EntityFrameworkCore;
namespace Mercado.Data;
public class AppDbContext : DbContext
{
    public DbSet<Models.ProdutoModel> Produtos { get; set; }
    public DbSet<Models.NotaModel> Notas { get; set; }
    public DbSet<Models.ItemNotaModel> ItensNota { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=mercado.sqlite");
        base.OnConfiguring(optionsBuilder);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Models.ProdutoModel>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p=> p.Produto).IsRequired().HasMaxLength(50);
            entity.Property(p=> p.Descricao).HasMaxLength(100);
            entity.Property(p=> p.Quantidade).IsRequired();
        });
        modelBuilder.Entity<Models.NotaModel>(entity =>
        {
            entity.HasKey(n => n.N);
            entity.Property(n=> n.N).ValueGeneratedOnAdd();
            entity.Property(n=> n.Status).IsRequired().HasConversion<string>().HasMaxLength(30);
            entity.HasMany(n => n.Itens).WithOne().HasForeignKey(i => i.NotaId).OnDelete(DeleteBehavior.Cascade);
            entity.Metadata.FindNavigation(nameof(Models.NotaModel.Itens))!.SetPropertyAccessMode(PropertyAccessMode.Field);
        });
        modelBuilder.Entity<Models.ItemNotaModel>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.Quantidade).IsRequired();
            entity.HasOne<Models.ProdutoModel>().WithMany().HasForeignKey(i => i.ProdId).OnDelete(DeleteBehavior.Restrict);
        });
    }
}