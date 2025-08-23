using Biblioteca.Domain.Common;

namespace Biblioteca.Domain.Entities;

public class Livro : BaseEntity
{
    public string Titulo { get; set; } = default!;
    public int AutorId { get; set; }
    public Autor Autor { get; set; } = default!;
    public int GeneroId { get; set; }
    public Genero Genero { get; set; } = default!;
    public DateTime? Publicacao { get; set; }

}
