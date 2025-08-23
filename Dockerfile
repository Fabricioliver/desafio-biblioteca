# 1) Build do front (Angular)
FROM node:20-alpine AS web
WORKDIR /front
COPY frontend/biblioteca-app/package*.json ./
# usa ci se existir lock, senão cai no install (mais resiliente)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY frontend/biblioteca-app .
RUN npm run build

# 2) Build do backend + embute a SPA no wwwroot
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# IMPORTANTE: copie o centralizador de versões ANTES do restore
COPY Directory.Packages.props ./

# copie só os .csproj primeiro para cachear o restore
COPY backend/src/Biblioteca.Api/Biblioteca.Api.csproj backend/src/Biblioteca.Api/
COPY backend/src/Biblioteca.Application/Biblioteca.Application.csproj backend/src/Biblioteca.Application/
COPY backend/src/Biblioteca.Domain/Biblioteca.Domain.csproj backend/src/Biblioteca.Domain/
COPY backend/src/Biblioteca.Infrastructure/Biblioteca.Infrastructure.csproj backend/src/Biblioteca.Infrastructure/
COPY backend/tests/Biblioteca.Tests/Biblioteca.Tests.csproj backend/tests/Biblioteca.Tests/

# faça o restore com o props presente
RUN dotnet restore backend/src/Biblioteca.Api/Biblioteca.Api.csproj

# agora copie o resto do código
COPY backend/ ./backend/

# coloque a SPA compilada dentro do wwwroot
COPY --from=web /front/dist/biblioteca-app/browser ./backend/src/Biblioteca.Api/wwwroot/browser

RUN dotnet publish backend/src/Biblioteca.Api/Biblioteca.Api.csproj -c Release -o /app/publish

# 3) Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["dotnet","Biblioteca.Api.dll"]
