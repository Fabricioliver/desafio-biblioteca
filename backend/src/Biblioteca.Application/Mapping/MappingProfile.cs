using AutoMapper;
using Biblioteca.Domain.Entities;
using Biblioteca.Application.DTOs;

namespace Biblioteca.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Genero, GeneroDto>();
        CreateMap<Autor, AutorDto>();
        CreateMap<Livro, LivroDto>()
            .ForMember(d => d.AutorNome, o => o.MapFrom(s => s.Autor.Nome))
            .ForMember(d => d.GeneroNome, o => o.MapFrom(s => s.Genero.Nome));

        CreateMap<CreateGeneroDto, Genero>();
        CreateMap<UpdateGeneroDto, Genero>();

        CreateMap<CreateAutorDto, Autor>();
        CreateMap<UpdateAutorDto, Autor>();

        CreateMap<CreateLivroDto, Livro>();
        CreateMap<UpdateLivroDto, Livro>();
    }
}
