namespace Biblioteca.Application.DTOs;

public record AutorDto
{
    public int Id { get; init; }
    public string Nome { get; init; } = string.Empty;
}

public record CreateAutorDto
{
    public string Nome { get; init; } = string.Empty;
}

public record UpdateAutorDto
{
    public string Nome { get; init; } = string.Empty;
}
