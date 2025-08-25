using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using AutoMapper;
using Biblioteca.Infrastructure.Data; // seu DbContext
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// -------------------------
// Connection string
// -------------------------
var connStr =
    builder.Configuration["ConnectionStrings__Default"] // preferência para var de ambiente (Docker/CI)
    ?? builder.Configuration["ConnectionStrings:Default"]
    ?? builder.Configuration.GetConnectionString("Default")
    ?? "Host=localhost;Port=5432;Username=postgres;Password=postgres;Database=biblioteca;SSL Mode=Disable;Trust Server Certificate=true";

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseNpgsql(connStr);
});

// -------------------------
// MVC / Controllers
// -------------------------
builder.Services.AddControllers();

// -------------------------
// AutoMapper
// -------------------------
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// -------------------------
// FluentValidation
// -------------------------
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(Assembly.Load("Biblioteca.Application"));

// -------------------------
// API Versioning + Explorer (gera grupos v1, v2...)
// -------------------------
builder.Services
    .AddApiVersioning(opt =>
    {
        opt.DefaultApiVersion = new ApiVersion(1, 0);
        opt.AssumeDefaultVersionWhenUnspecified = true;
        opt.ReportApiVersions = true;
        opt.ApiVersionReader = new UrlSegmentApiVersionReader(); // usa /v{version} na rota
    })
    .AddApiExplorer(opt =>
    {
        opt.GroupNameFormat = "'v'VVV";           // v1, v2, v3
        opt.SubstituteApiVersionInUrl = true;
    });

// -------------------------
// Swagger (sem BuildServiceProvider aqui!)
// -------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Doc default para funcionar mesmo sem vários grupos
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Biblioteca API",
        Version = "v1"
    });
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// -------------------------
// Migrations automáticas (opcional)
// -------------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// -------------------------
// Pipeline
// -------------------------
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    // Ativa Swagger e descobre versões via DI **depois** do Build:
    app.UseSwagger();

    var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
    app.UseSwaggerUI(c =>
    {
        // Se houver múltiplas versões, cria uma aba por versão; senão, fica só v1
        foreach (var desc in provider.ApiVersionDescriptions)
        {
            c.SwaggerEndpoint($"/swagger/{desc.GroupName}/swagger.json",
                $"Biblioteca API {desc.ApiVersion}");
        }
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// -------------------------
// Porta padrão p/ Docker/Cloud
// -------------------------
var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (string.IsNullOrWhiteSpace(urls))
    app.Urls.Add("http://0.0.0.0:8080");

app.Run();
