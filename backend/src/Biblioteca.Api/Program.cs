using Biblioteca.Application.DTOs;
using Biblioteca.Application.Mapping;
using Biblioteca.Infrastructure.Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(connectionString));

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
    setup.GroupNameFormat = "'v'VVV";       // "v1", "v1.0"
    setup.SubstituteApiVersionInUrl = true; // usa {version:apiVersion} na rota
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("dev", p => p
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseCors("dev");
}

app.UseDefaultFiles(new Microsoft.AspNetCore.Builder.DefaultFilesOptions
{
    // permite / ou /browser/ ser index
    DefaultFileNames = { "index.html", "browser/index.html" }
});
app.UseStaticFiles();

// ---- API ----
app.MapControllers();

// ---- Migrations on startup ----
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ---- SPA fallback (deep links) ----
var webRoot = app.Environment.WebRootPath ?? "wwwroot";
var spaIndexBrowser = Path.Combine(webRoot, "browser", "index.html");
if (File.Exists(spaIndexBrowser))
{
    app.MapFallbackToFile("/browser/index.html");
}
else
{
    app.MapFallbackToFile("/index.html");
}

app.Run();
