using Biblioteca.Domain.Common;
using Biblioteca.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<Genero> Generos => Set<Genero>();
    public DbSet<Autor> Autores => Set<Autor>();
    public DbSet<Livro> Livros => Set<Livro>();

    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property(nameof(BaseEntity.CreatedAt))
                    .HasDefaultValueSql("timezone('utc', now())")
                    .ValueGeneratedOnAdd();

                modelBuilder.Entity(entityType.ClrType)
                    .Property(nameof(BaseEntity.UpdatedAt))
                    .HasDefaultValueSql("timezone('utc', now())")
                    .ValueGeneratedOnAddOrUpdate();
            }
        }

        // Seeds com valores fixos
        modelBuilder.Entity<Genero>().HasData(
            new { Id = 1, Nome = "Ficção" },
            new { Id = 2, Nome = "Tecnologia" }
        );

        modelBuilder.Entity<Autor>().HasData(
            new { Id = 1, Nome = "Autor Exemplo" }
        );

        modelBuilder.Entity<Livro>().HasData(
            new
            {
                Id = 1,
                Titulo = "Livro Demo",
                AutorId = 1,
                GeneroId = 1,
                Publicacao = new DateTime(2020, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }

}
