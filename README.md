# Desafio Biblioteca — Guia de Execução

> **Backend:** .NET 9  
> **Frontend:** Angular 17  
> **Dev:** API em **HTTP** → `http://localhost:5077` (Angular usa **proxy**)  
> **Produção:** a **API** serve a **SPA** (single host).

---

## Pré‑requisitos

- **.NET SDK 9.0+**
- **Node.js 18+** (ou 20) e **npm**
- **Angular CLI** `npm i -g @angular/cli`
- **PostgreSQL 14+** (se rodar banco fora de docker)
- **Git**

**Para Docker (opcional):**
- **Docker Desktop** 4.x (com Compose v2)

> Dev HTTPS é opcional: `dotnet dev-certs https --trust`

---

## Estrutura

```
desafio-biblioteca/
├─ backend/
│  ├─ src/
│  │  ├─ Biblioteca.Api/
│  │  │  ├─ Program.cs
│  │  │  └─ wwwroot/        # gerado no publish
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

- **Versionamento de pacotes centralizado** em `Directory.Packages.props` (não use `Version="..."` nos `.csproj`).

---

## Configuração (appsettings)

`backend/src/Biblioteca.Api/appsettings.Development.json`
```jsonc
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=biblioteca;Username=postgres;Password=postgres"
  }
}
```

`Program.cs`
```csharp
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
```

---

## Banco (EF Core)

Aplicar migrations (se necessário):
```powershell
cd backend/src/Biblioteca.Infrastructure
dotnet ef migrations add Init --project . --startup-project ../Biblioteca.Api
dotnet ef database update --project . --startup-project ../Biblioteca.Api
```

> O projeto também aplica `Database.Migrate()` no **startup** da API.

---

## Rodando em **desenvolvimento (sem Docker)**

**API** (porta 5077):
```powershell
cd backend/src/Biblioteca.Api
dotnet run
# → http://localhost:5077
```

**Angular** com **proxy** para a API:
`frontend/biblioteca-app/proxy.conf.json`
```jsonc
{
  "/api": { "target": "http://localhost:5077", "changeOrigin": true, "logLevel": "debug" }
}
```
```powershell
cd frontend/biblioteca-app
npm ci
ng serve --proxy-config proxy.conf.json --port 4200
# → http://localhost:4200
```

---

## Execução com **Docker**

> Você pode usar Docker para **desenvolver** (banco no Docker e API local), ou para **subir tudo** (API + SPA + DB).

### Opção A — **Dev com banco em Docker** (recomendado)
Compose mínimo só para o PostgreSQL:
```yaml
# docker-compose.db.yml (na raiz do repositório)
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: biblioteca
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - dbdata:/var/lib/postgresql/data
volumes:
  dbdata:
```
Suba o banco e rode a API/Angular **fora** do Docker:
```bash
docker compose -f docker-compose.db.yml up -d
# API -> dotnet run (5077)
# Front -> ng serve (4200) usando o proxy para /api
```

### Opção B — **Tudo em Docker** (API + SPA + DB)
O Dockerfile (multi‑stage) gera a SPA e publica a API. Exponha a porta **8080** na API.

**Dockerfile** (na raiz do repo) – exemplo compatível com o projeto:
```Dockerfile
# 1) build do front
FROM node:20-alpine AS web
WORKDIR /front
COPY frontend/biblioteca-app ./
RUN npm ci && npm run build

# 2) build da API (.NET SDK)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY backend ./backend
COPY --from=web /front/dist/biblioteca-app/browser ./backend/src/Biblioteca.Api/wwwroot
RUN dotnet restore backend/src/Biblioteca.Api/Biblioteca.Api.csproj
RUN dotnet publish backend/src/Biblioteca.Api/Biblioteca.Api.csproj -c Release -o /app/publish

# 3) runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Biblioteca.Api.dll"]
```

**docker-compose.yml** (raiz):
```yaml

Subir tudo:
```bash
docker compose up -d --build
# API + SPA -> http://localhost:8080
# Swagger (dev) -> http://localhost:8080/swagger
```

> As migrations são aplicadas no startup da API.  
> Para logs: `docker compose logs -f api`

**Executar somente a imagem da API** (sem Compose):
```bash
docker build -t desafio-biblioteca-api -f Dockerfile .
docker run --rm -p 8080:8080   -e ConnectionStrings__Default="Host=host.docker.internal;Port=5432;Database=biblioteca;Username=postgres;Password=postgres"   desafio-biblioteca-api
```

---

## OpenAPI / Swagger

Em **dev**:
- `GET /openapi/v1.json` (ou conforme configuração)
- UI: habilite no `Program.cs` com Swashbuckle (`UseSwagger`/`UseSwaggerUI`)

---

## Testes

```bash
dotnet test backend/tests/Biblioteca.Tests
```

---

## Comandos úteis

```bash
# limpar bin/obj
Get-ChildItem -Recurse -Directory -Include bin,obj | Remove-Item -Recurse -Force
dotnet clean && dotnet restore

# limpar cache do NuGet
dotnet nuget locals all -c
```

---

## FAQ

- "Failed to determine the https port for redirect": use apenas HTTP em dev ou confie os dev‑certs.
- "wwwroot não encontrado": normal em dev; no publish a SPA é copiada.
- Conflitos de versão: versões ficam só no `Directory.Packages.props`.

---

## Checklist

- [ ] `Directory.Packages.props` sem `Version=` nos `.csproj`
- [ ] `ConnectionStrings:Default` apontando para o banco
- [ ] Migrations aplicadas / auto‑migrate no startup
- [ ] Dev: API `http://localhost:5077` + Angular `http://localhost:4200`
- [ ] Docker (opcional): `docker compose up -d --build` → `http://localhost:8080`
