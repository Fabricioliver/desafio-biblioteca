using Biblioteca.Application.DTOs;
using Biblioteca.Application.Mapping;
using Biblioteca.Infrastructure.Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

builder.Services.AddValidatorsFromAssemblyContaining<GeneroDto>();
builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddControllers();

builder.Services.AddApiVersioning(o =>
{
    o.DefaultApiVersion = new ApiVersion(1, 0);
    o.AssumeDefaultVersionWhenUnspecified = true;
    o.ReportApiVersions = true;
});
builder.Services.AddVersionedApiExplorer(setup =>
{
    setup.GroupNameFormat = "'v'VVV";          // "v1", "v1.0"
    setup.SubstituteApiVersionInUrl = true;    // usa {version:apiVersion} na rota
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ---------------- (Opcional) CORS para o Angular local ----------------
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend",
        p => p.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// (Opcional) habilita CORS
app.UseCors("frontend");

app.MapControllers();

app.Run();
