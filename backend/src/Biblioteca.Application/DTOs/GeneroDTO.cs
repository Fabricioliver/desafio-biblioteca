namespace Biblioteca.Application.DTOs;

public record GeneroDto
{
    public int Id { get; init; }
    public string Nome { get; init; } = string.Empty;
}

public record CreateGeneroDto
{
    public string Nome { get; init; } = string.Empty;
}

public record UpdateGeneroDto
{
    public string Nome { get; init; } = string.Empty;
}
