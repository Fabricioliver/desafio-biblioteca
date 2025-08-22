using AutoMapper;
using Biblioteca.Application.DTOs;
using Biblioteca.Domain.Entities;
using Biblioteca.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Api.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/autores")]
public class AutoresController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public AutoresController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AutorDto>>> GetAll()
    {
        var itens = await _db.Autores.AsNoTracking().OrderBy(a => a.Nome).ToListAsync();
        return Ok(_mapper.Map<IEnumerable<AutorDto>>(itens));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AutorDto>> GetById(int id)
    {
        var entity = await _db.Autores.FindAsync(id);
        if (entity is null) return NotFound();
        return Ok(_mapper.Map<AutorDto>(entity));
    }

    [HttpPost]
    public async Task<ActionResult<AutorDto>> Create([FromBody] CreateAutorDto dto)
    {
        var entity = new Autor { Nome = dto.Nome };
        _db.Autores.Add(entity);
        await _db.SaveChangesAsync();

        var vm = _mapper.Map<AutorDto>(entity);
        return CreatedAtAction(nameof(GetById), new { id = vm.Id, version = "1.0" }, vm);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAutorDto dto)
    {
        var entity = await _db.Autores.FindAsync(id);
        if (entity is null) return NotFound();

        entity.Nome = dto.Nome;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _db.Autores.FindAsync(id);
        if (entity is null) return NotFound();

        _db.Autores.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
