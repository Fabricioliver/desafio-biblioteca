using FluentValidation;
using Biblioteca.Application.DTOs;

namespace Biblioteca.Application.Validation
{
    public class LivroCreateValidator : AbstractValidator<CreateLivroDto>
    {
        public LivroCreateValidator()
        {
            RuleFor(x => x.Titulo)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.AutorId)
                .GreaterThan(0);

            RuleFor(x => x.GeneroId)
                .GreaterThan(0);

            // Se adicionar Data de Publicação no DTO:
            // RuleFor(x => x.Publicacao).LessThanOrEqualTo(DateTime.UtcNow);
        }
    }
}
