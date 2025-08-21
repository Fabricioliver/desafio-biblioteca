namespace Biblioteca.Application.DTOs
{
    public class LivroDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public int AutorId { get; set; }
        public string AutorNome { get; set; } = string.Empty;
        public int GeneroId { get; set; }
        public string GeneroNome { get; set; } = string.Empty;
    }

    public class CreateLivroDto
    {
        public string Titulo { get; set; } = string.Empty;
        public int AutorId { get; set; }
        public int GeneroId { get; set; }
    }

    public class UpdateLivroDto
    {
        public string Titulo { get; set; } = string.Empty;
        public int AutorId { get; set; }
        public int GeneroId { get; set; }
    }
}
