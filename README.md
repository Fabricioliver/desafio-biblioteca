# Desafio Biblioteca — Guia de Execução

> .NET 9 no **backend**
> Angular no **frontend** 
> Em **dev** ---> **HTTP** em `http://localhost:5077` 
> Angular com **proxy**

> Em **produção**, a API serve a SPA (single host).

---

## Pré‑requisitos

- **.NET SDK 9.0+**
- **Node.js 18+** (recomendado 18 LTS ou 20) e **npm**
- **Angular CLI** (`npm i -g @angular/cli`)
- **PostgreSQL 14+** (ou o provider que estiver usando)
- **Git**

Opcional (dev):
- Certificados dev HTTPS: `dotnet dev-certs https --trust`

---

## Estrutura do projeto

> Branch **main**

```
desafio-biblioteca/
├─ backend/
│  ├─ src/
│  │  ├─ Biblioteca.Api/
│  │  │  ├─ Program.cs
│  │  │  ├─ Properties/launchSettings.json
│  │  │  └─ wwwroot/                 # (gerado no publish; ignorado no git)
│  │  ├─ Biblioteca.Application/
│  │  ├─ Biblioteca.Infrastructure/
│  │  └─ Biblioteca.Domain/
│  └─ tests/
│     └─ Biblioteca.Tests/
└─ frontend/
   └─ biblioteca-app/
      ├─ proxy.conf.json
      └─ src/...
```

- **Gerenciamento de pacotes centralizado**: 
> `Directory.Packages.props` na raiz define TODAS as versões (não use `Version=` nos `.csproj`).

---

## Configuração (banco e appsettings)

> No `backend/src/Biblioteca.Api/appsettings.Development.json`

```jsonc
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=biblioteca;Username=postgres;Password=postgres"
  }
}
```

>No `Program.cs` (API):

```csharp
using Microsoft.EntityFrameworkCore;
// ...
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
```

---

## 🧪 Banco de dados (EF Core)

### Criar/atualizar o schema

```powershell
# na raiz do repo
cd backend/src/Biblioteca.Infrastructure
dotnet ef migrations add Init --project . --startup-project ../Biblioteca.Api
dotnet ef database update --project . --startup-project ../Biblioteca.Api
```

> Já tem migrations? Pule o `add` e rode só o `database update`.

---

## Rodando em desenvolvimento (HTTP)

Backend (API) — porta 5077:
```powershell
cd backend/src/Biblioteca.Api
dotnet run
# Now listening on: http://localhost:5077
```

Frontend (Angular) com **proxy**:
```jsonc
// frontend/biblioteca-app/proxy.conf.json
{
  "/api": { "target": "http://localhost:5077", "changeOrigin": true, "logLevel": "debug" }
}
```
```powershell
cd frontend/biblioteca-app
npm ci
ng serve --proxy-config proxy.conf.json --port 4200
# http://localhost:4200
```

- Chamadas a `/api/...` no Angular são roteadas para a API.
- Em dev servimos **apenas API**; a SPA é servida pelo Angular CLI.

---

## Build/Publish para produção (single host)

O `.csproj` da API já compila o Angular no **publish** e copia o `dist` para `wwwroot`.

```powershell
cd backend/src/Biblioteca.Api
dotnet publish -c Release
cd bin/Release/net9.0/publish
dotnet Biblioteca.Api.dll
# Abra http://localhost:5xxx  → "/" carrega a SPA, "/api/..." serve a API
```

> Em produção, a API habilita HTTPS e serve arquivos estáticos (`UseDefaultFiles/UseStaticFiles/MapFallbackToFile`) **apenas se `wwwroot` existir**.

---

## OpenAPI / Swagger

- Em **dev**, a API expõe o documento **OpenAPI** em:  
  `GET /openapi/v1.json` (ou `/openapi` dependendo da configuração).

- **Swagger UI**, instalar `Swashbuckle.AspNetCore` e adicione no `Program.cs`:
  ```csharp
  builder.Services.AddSwaggerGen();
  if (app.Environment.IsDevelopment())
  {
      app.UseSwagger();
      app.UseSwaggerUI();
  }
  ```

---

## Testes

Projeto: `backend/tests/Biblioteca.Tests` (xUnit).

```powershell
dotnet test backend/tests/Biblioteca.Tests
```

Exemplo mínimo de teste:
```csharp
using Xunit;
using FluentAssertions;

public class UnitTest1
{
    [Fact]
    public void Deve_passar()
    {
        true.Should().BeTrue();
    }
}
```

---

## Comandos úteis

**Limpeza de build/lixo NuGet**
```powershell
Get-ChildItem -Recurse -Directory -Include bin,obj | Remove-Item -Recurse -Force
dotnet clean
dotnet nuget locals all -c
dotnet restore
```

**Forçar centralização (remover `Version=` dos csproj)**
```powershell
Get-ChildItem -Recurse -Filter *.csproj |
  % { $p=$_.FullName; (Get-Content -Raw $p) -replace ' Version="[^"]+"','' | Set-Content -Encoding UTF8 $p }
```

**Verificar pacotes do projeto**
```powershell
dotnet list backend/src/Biblioteca.Api package
dotnet list backend/src/Biblioteca.Infrastructure package
dotnet list backend/tests/Biblioteca.Tests package
```

---

## Solução de problemas (FAQ)

**️ “Failed to determine the https port for redirect”**  
Você está ouvindo só HTTP em dev. Soluções:
- Desabilitar `UseHttpsRedirection()` em dev, **ou**
- Ativar certificados dev: `dotnet dev-certs https --trust` e expor `https://localhost:5001` no `launchSettings.json`.

**️ “The WebRootPath was not found …/wwwroot”**  
Normal em dev (SPA não publicada). Em produção (`dotnet publish`), o `wwwroot` será preenchido.

**️ NU1008 — “projetos com versão central não devem definir Version=”**  
Remova `Version="..."` de todos os `<PackageReference>` nos `.csproj`. As versões ficam **somente** no `Directory.Packages.props`.

**️ MSB3277 — conflitos de versões EF Core (ex.: 9.0.1 vs 9.0.8)**  
Centralize tudo no `Directory.Packages.props` e evite duplicar refs. Se a API puxar EF transitivo, adicione `Microsoft.EntityFrameworkCore`/`Relational` **diretos** no projeto para firmar a 9.0.8.

**️ `[Fact]` / `FactAttribute` não encontrados**  
Inclua `xunit` e `Microsoft.NET.Test.Sdk` no projeto de testes e `using Xunit;` nos arquivos.

---

## Checklist rápido

- [ ] `Directory.Packages.props` na raiz (sem wildcards, versões fixas).
- [ ] Nenhum `.csproj` com `Version=` em `<PackageReference>`.
- [ ] `appsettings.Development.json` com `ConnectionStrings:Default`.
- [ ] Migrations aplicadas: `dotnet ef database update`.
- [ ] Dev: `dotnet run` (API em `http://localhost:5077`) + `ng serve --proxy-config proxy.conf.json`.
- [ ] Prod: `dotnet publish -c Release` → SPA servida pela API.

---

## Endpoints de exemplo

- `GET /api/weatherforecast` — sample.
- `GET /openapi/v1.json` — OpenAPI (em dev).

---

## CI/CD

- Job **API**: `dotnet publish -c Release` → publicar a pasta `publish/`.
- Job **Infra** (opcional): provisiona banco.
- Em Docker, use um **Nginx** na frente se quiser host + API separados.

---

Qualquer dúvida, **Estou a disposição**
