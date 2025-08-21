using Microsoft.EntityFrameworkCore;
using Biblioteca.Domain.Entities;

namespace Biblioteca.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<Genero> Generos => Set<Genero>();
    public DbSet<Autor> Autores => Set<Autor>();
    public DbSet<Livro> Livros => Set<Livro>();

    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt) { }

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Genero>(e =>
        {
            e.ToTable("generos");
            e.HasKey(x => x.Id);

            e.Property(x => x.Nome)
                .IsRequired()
                .HasMaxLength(100);

            e.HasIndex(x => x.Nome).IsUnique();
        });

        b.Entity<Autor>(e =>
        {
            e.ToTable("autores");
            e.HasKey(x => x.Id);

            e.Property(x => x.Nome)
                .IsRequired()
                .HasMaxLength(150);

            e.HasIndex(x => x.Nome).IsUnique();
        });

        b.Entity<Livro>(e =>
        {
            e.ToTable("livros");
            e.HasKey(x => x.Id);

            e.Property(x => x.Titulo)
                .IsRequired()
                .HasMaxLength(200);

            e.Property(x => x.AutorId).IsRequired();
            e.Property(x => x.GeneroId).IsRequired();

            e.HasOne(x => x.Autor)
                .WithMany(a => a.Livros)
                .HasForeignKey(x => x.AutorId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Genero)
                .WithMany(g => g.Livros)
                .HasForeignKey(x => x.GeneroId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(x => x.Titulo);
        });

        b.Entity<Genero>().HasData(new { Id = 1, Nome = "Ficção" });
        b.Entity<Autor>().HasData(new { Id = 1, Nome = "Autor Exemplo" });
        b.Entity<Livro>().HasData(new
        {
            Id = 1,
            Titulo = "Livro Demo",
            AutorId = 1,
            GeneroId = 1,
            Publicacao = DateTime.UtcNow
        });
    }
}
