using AutoMapper;
using Biblioteca.Application.DTOs;
using Biblioteca.Domain.Entities;
using Biblioteca.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Api.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/livros")]
public class LivrosController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public LivrosController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LivroDto>>> GetAll()
    {
        var itens = await _db.Livros
            .AsNoTracking()
            .Include(l => l.Autor)
            .Include(l => l.Genero)
            .OrderBy(l => l.Titulo)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<LivroDto>>(itens));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<LivroDto>> GetById(int id)
    {
        var entity = await _db.Livros
            .Include(l => l.Autor)
            .Include(l => l.Genero)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (entity is null) return NotFound();
        return Ok(_mapper.Map<LivroDto>(entity));
    }

    [HttpPost]
    public async Task<ActionResult<LivroDto>> Create([FromBody] CreateLivroDto dto)
    {
        // valida FKs
        var autorExists = await _db.Autores.AnyAsync(a => a.Id == dto.AutorId);
        var generoExists = await _db.Generos.AnyAsync(g => g.Id == dto.GeneroId);
        if (!autorExists || !generoExists)
            return BadRequest(new { error = "AutorId ou GeneroId inválidos." });

        var entity = new Livro
        {
            Titulo = dto.Titulo,
            AutorId = dto.AutorId,
            GeneroId = dto.GeneroId,
            Publicacao = dto.Publicacao
        };

        _db.Add(entity);
        await _db.SaveChangesAsync();

        // recarrega com include para mapear nomes
        entity = await _db.Livros.Include(l => l.Autor).Include(l => l.Genero)
            .FirstAsync(l => l.Id == entity.Id);

        var vm = _mapper.Map<LivroDto>(entity);
        return CreatedAtAction(nameof(GetById), new { id = vm.Id, version = "1.0" }, vm);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateLivroDto dto)
    {
        var entity = await _db.Livros.FindAsync(id);
        if (entity is null) return NotFound();

        // valida FKs
        var autorExists = await _db.Autores.AnyAsync(a => a.Id == dto.AutorId);
        var generoExists = await _db.Generos.AnyAsync(g => g.Id == dto.GeneroId);
        if (!autorExists || !generoExists)
            return BadRequest(new { error = "AutorId ou GeneroId inválidos." });

        entity.Titulo = dto.Titulo;
        entity.AutorId = dto.AutorId;
        entity.GeneroId = dto.GeneroId;
        entity.Publicacao = dto.Publicacao;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Livros.FindAsync(id);
        if (entity is null) return NotFound();

        _db.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
