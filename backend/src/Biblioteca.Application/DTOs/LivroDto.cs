namespace Biblioteca.Application.DTOs;

public record LivroDto
{
    public int Id { get; init; }
    public string Titulo { get; init; } = string.Empty;
    public int AutorId { get; init; }
    public string AutorNome { get; init; } = string.Empty;
    public int GeneroId { get; init; }
    public string GeneroNome { get; init; } = string.Empty;
    public System.DateTime Publicacao { get; init; }
}

public record CreateLivroDto
{
    public string Titulo { get; init; } = string.Empty;
    public int AutorId { get; init; }
    public int GeneroId { get; init; }
    public System.DateTime Publicacao { get; init; }
}

public record UpdateLivroDto
{
    public string Titulo { get; init; } = string.Empty;
    public int AutorId { get; init; }
    public int GeneroId { get; init; }
    public System.DateTime Publicacao { get; init; }
}
