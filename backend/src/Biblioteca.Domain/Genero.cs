using Biblioteca.Domain.Common;

namespace Biblioteca.Domain.Entities;

public class Genero : BaseEntity
{
    public string Nome { get; set; } = default!;

    public ICollection<Livro> Livros { get; set; } = new List<Livro>();
}
