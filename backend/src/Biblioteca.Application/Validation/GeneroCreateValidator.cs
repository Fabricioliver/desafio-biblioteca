using FluentValidation;
using Biblioteca.Application.DTOs;

namespace Biblioteca.Application.Validation
{
    public class GeneroCreateValidator : AbstractValidator<CreateGeneroDto>
    {
        public GeneroCreateValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty()
                .MaximumLength(100);
        }
    }
}
