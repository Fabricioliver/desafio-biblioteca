using AutoMapper;
using Biblioteca.Application.DTOs;
using Biblioteca.Domain.Entities;
using Biblioteca.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Asp.Versioning;

namespace Biblioteca.Api.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/generos")]
public class GenerosController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public GenerosController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GeneroDto>>> GetAll()
    {
        var itens = await _db.Generos.AsNoTracking().OrderBy(g => g.Nome).ToListAsync();
        return Ok(_mapper.Map<IEnumerable<GeneroDto>>(itens));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GeneroDto>> GetById(int id)
    {
        var entity = await _db.Generos.FindAsync(id);
        if (entity is null) return NotFound();
        return Ok(_mapper.Map<GeneroDto>(entity));
    }

    [HttpPost]
    public async Task<ActionResult<GeneroDto>> Create([FromBody] CreateGeneroDto dto)
    {
        var entity = new Genero { Nome = dto.Nome };
        _db.Generos.Add(entity);
        await _db.SaveChangesAsync();

        var vm = _mapper.Map<GeneroDto>(entity);
        return CreatedAtAction(nameof(GetById), new { id = vm.Id, version = "1.0" }, vm);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateGeneroDto dto)
    {
        var entity = await _db.Generos.FindAsync(id);
        if (entity is null) return NotFound();

        entity.Nome = dto.Nome;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Generos.FindAsync(id);
        if (entity is null) return NotFound();

        _db.Generos.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
