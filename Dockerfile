# 1) Build do front
FROM node:20-alpine AS web
WORKDIR /front
# Copia apenas manifests primeiro para cache melhor
COPY frontend/biblioteca-app/package*.json ./
RUN npm ci
# Copia o restante e builda
COPY frontend/biblioteca-app/ ./
RUN npm run build

# 2) Build/publish da API (.NET 9 SDK)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia solução/back-end
COPY backend/ ./backend/

# Copia artefatos do front para a pasta estática da API
RUN mkdir -p backend/src/Biblioteca.Api/wwwroot/browser
COPY --from=web /front/dist/biblioteca-app/browser ./backend/src/Biblioteca.Api/wwwroot/browser

# Restaura, compila e publica
RUN dotnet restore backend/src/Biblioteca.Api/Biblioteca.Api.csproj
RUN dotnet publish backend/src/Biblioteca.Api/Biblioteca.Api.csproj -c Release -o /app/publish

# 3) Runtime (.NET 9 ASPNET)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
# Porta HTTP padrão para o container
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Biblioteca.Api.dll"]
