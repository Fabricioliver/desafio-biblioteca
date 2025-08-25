using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// OpenAPI (pode manter se quiser o MapOpenApi no dev)
builder.Services.AddOpenApi();

// CORS só no dev (Angular dev server)
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy.WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200",
                "http://127.0.0.1:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ===== API Versioning =====
builder.Services.AddApiVersioning(opt =>
{
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ReportApiVersions = true;

    // Lê a versão por segmento de URL, querystring e header
    opt.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new QueryStringApiVersionReader("v", "api-version"),
        new HeaderApiVersionReader("x-api-version")
    );
});

// Exploração por versão (para Swagger por versão)
builder.Services.AddVersionedApiExplorer(opt =>
{
    opt.GroupNameFormat = "'v'VVV";
    opt.SubstituteApiVersionInUrl = true;
});

// Swagger (UI)
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- DEV ---
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();       // opcional, tua OpenAPI minimal
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
        foreach (var desc in provider.ApiVersionDescriptions)
            c.SwaggerEndpoint($"/swagger/{desc.GroupName}/swagger.json", desc.GroupName.ToUpperInvariant());
    });

    app.UseCors("DevCors");
}
else
{
    // --- PRODUÇÃO: HTTPS + SPA estática (se houver wwwroot) ---
    app.UseHttpsRedirection();

    var webRoot = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
    if (Directory.Exists(webRoot))
    {
        app.UseDefaultFiles();
        app.UseStaticFiles();
    }

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

// (opcional) exemplo minimal que você já tinha
var summaries = new[]
{
    "Freezing","Bracing","Chilly","Cool","Mild","Warm","Balmy","Hot","Sweltering","Scorching"
};
app.MapGet("/api/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        )).ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Fallback da SPA só em produção e se wwwroot existir
if (!app.Environment.IsDevelopment() && Directory.Exists(Path.Combine(app.Environment.ContentRootPath, "wwwroot")))
{
    app.MapFallbackToFile("index.html");
}

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
