FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar arquivos de projeto
COPY ["PrimordialDuckOperation.Api/PrimordialDuckOperation.Api.csproj", "PrimordialDuckOperation.Api/"]
COPY ["PrimordialDuckOperation.Application/PrimordialDuckOperation.Application.csproj", "PrimordialDuckOperation.Application/"]
COPY ["PrimordialDuckOperation.Domain/PrimordialDuckOperation.Domain.csproj", "PrimordialDuckOperation.Domain/"]
COPY ["PrimordialDuckOperation.Infrastructure/PrimordialDuckOperation.Infrastructure.csproj", "PrimordialDuckOperation.Infrastructure/"]
COPY ["PrimordialDuckOperation.CrossCutting/PrimordialDuckOperation.CrossCutting.csproj", "PrimordialDuckOperation.CrossCutting/"]

# Restaurar dependências
RUN dotnet restore "PrimordialDuckOperation.Api/PrimordialDuckOperation.Api.csproj"

# Copiar todo o código fonte
COPY . .

# Build do projeto
WORKDIR "/src/PrimordialDuckOperation.Api"
RUN dotnet build "PrimordialDuckOperation.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PrimordialDuckOperation.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Aplicar migrations no startup
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "PrimordialDuckOperation.Api.dll"]