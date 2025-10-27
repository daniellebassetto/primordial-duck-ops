using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using PrimordialDuckOperation.Application.Interfaces;
using PrimordialDuckOperation.Application.Services;
using PrimordialDuckOperation.CrossCutting.Swagger;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Interfaces;
using PrimordialDuckOperation.Infrastructure.Data;
using PrimordialDuckOperation.Infrastructure.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace PrimordialDuckOperation.CrossCutting;

public static class ConfigureServicesExtension
{
    private static IServiceCollection ServiceCollection { get; set; } = new ServiceCollection();
    private static IConfiguration? Configuration { get; set; }

    public static IServiceCollection ConfigureDependencyInjection(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        ServiceCollection = serviceCollection;
        Configuration = configuration;

        AddControlers();
        AddOptions();
        AddMySql();
        AddIdentity();
        AddScoped();
        AddSingleton();
        AddSwaggerGen();
        AddToken();
        AddCors();

        return ServiceCollection;
    }

    private static void AddControlers()
    {
        ServiceCollection.AddControllers().AddNewtonsoftJson(options =>
        {
            options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            options.SerializerSettings.Formatting = Formatting.Indented;
            options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        });
    }

    private static void AddOptions()
    {
        ServiceCollection.AddOptions();
    }

    private static void AddScoped()
    {
        ServiceCollection.AddScoped<AuthService>();
        ServiceCollection.AddScoped<CaptureAnalysisService>();
        ServiceCollection.AddScoped<CaptureStrategyService>();

        ServiceCollection.AddScoped<ICaptureOperationRepository, CaptureOperationRepository>();
        ServiceCollection.AddScoped<IPrimordialDuckRepository, PrimordialDuckRepository>();
        ServiceCollection.AddScoped<IDroneRepository, DroneRepository>();
        ServiceCollection.AddScoped<ISuperPowerRepository, SuperPowerRepository>();

        ServiceCollection.AddScoped<ICaptureOperationService, CaptureOperationService>();
        ServiceCollection.AddScoped<IPrimordialDuckService, PrimordialDuckService>();
        ServiceCollection.AddScoped<IDroneService, DroneService>();
        ServiceCollection.AddScoped<ISuperPowerService, SuperPowerService>();
    }

    private static void AddSingleton()
    {
        ServiceCollection.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
    }

    private static void AddSwaggerGen()
    {
        OpenApiContact contact = new()
        {
            Name = "GitHub",
            Url = new Uri("https://github.com/danibassetto")
        };

        ServiceCollection.AddSwaggerGen(x =>
        {
            x.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Primordial Duck Operation",
                Description = "O ENIGMA DOS PATOS PRIMORDIAIS - Dsin Coder Challenge 2025",
                Version = "v1",
                Contact = contact
            });

            x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                Name = "JWT Authentication",
                Description = "Digitar somente JWT Bearer token",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                Reference = new OpenApiReference
                {
                    Id = JwtBearerDefaults.AuthenticationScheme,
                    Type = ReferenceType.SecurityScheme
                }
            });

            x.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });

            x.SchemaFilter<EnumSchemaFilter>();
        });


    }

    public static void AddToken()
    {
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
        ServiceCollection.AddAuthentication((options) =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(c =>
        {
            c.RequireHttpsMetadata = false;
            c.SaveToken = true;
            c.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("PrimordialDuckOperationSecretKey123456789")),
                ClockSkew = TimeSpan.Zero
            };
        });
    }

    private static void AddMySql()
    {
        var connectionString = Configuration!.GetConnectionString("DefaultConnection");
        ServiceCollection.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
    }

    private static void AddIdentity()
    {
        ServiceCollection.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 6;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();
    }

    private static void AddCors()
    {
        ServiceCollection.AddCors(options => options.AddPolicy("AllowReactApp", policy => policy.WithOrigins("http://localhost:3000").AllowAnyMethod().SetIsOriginAllowed(pol => true).AllowAnyHeader().AllowCredentials()));
    }

    public static async Task<WebApplication> ConfigurePrimordialDuckApp(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            context.Database.Migrate();
            await DataSeeder.SeedAsync(context, scope.ServiceProvider);
        }

        return app;
    }
}