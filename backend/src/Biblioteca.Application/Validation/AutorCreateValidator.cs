using FluentValidation;
using Biblioteca.Application.DTOs;

namespace Biblioteca.Application.Validation
{
    public class AutorCreateValidator : AbstractValidator<CreateAutorDto>
    {
        public AutorCreateValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty()
                .MaximumLength(150);
        }
    }
}
