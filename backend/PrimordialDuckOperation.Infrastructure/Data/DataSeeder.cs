using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, IServiceProvider? serviceProvider = null)
    {
        if (!await context.SuperPowers.AnyAsync())
        {
            var superPowers = new List<SuperPower>
            {
                new("Tempestade Elétrica", "Gera descargas elétricas em área", SuperPowerClassificationEnum.Warlike),
                new("Manipulação Aquática", "Controle total sobre massas de água", SuperPowerClassificationEnum.Elemental),
                new("Camuflagem Dimensional", "Invisibilidade por alteração dimensional", SuperPowerClassificationEnum.Dimensional),
                new("Regeneração Acelerada", "Cura instantânea de ferimentos", SuperPowerClassificationEnum.Biological),
                new("Controle Gravitacional", "Manipulação da gravidade local", SuperPowerClassificationEnum.Psychic),
                new("Rajada de Plasma", "Projeção de energia plasma", SuperPowerClassificationEnum.Warlike),
                new("Duplicação Temporal", "Criação de cópias temporárias", SuperPowerClassificationEnum.Temporal),
                new("Escudo Energético", "Barreira de energia protetiva", SuperPowerClassificationEnum.Defensive),
                new("Teletransporte", "Deslocamento instantâneo no espaço", SuperPowerClassificationEnum.Dimensional),
                new("Controle Mental", "Dominação de mentes fracas", SuperPowerClassificationEnum.Psychic),
                new("Metamorfose Corporal", "Alteração da forma física", SuperPowerClassificationEnum.Biological),
                new("Pulso Eletromagnético", "Desativa equipamentos eletrônicos", SuperPowerClassificationEnum.Technological)
            };

            await context.SuperPowers.AddRangeAsync(superPowers);
            await context.SaveChangesAsync();
        }

        if (!await context.Drones.AnyAsync())
        {
            var drones = new List<Drone>
            {
                new("RECON-001", "SkyEye Pro", "TechCorp", "Brasil", DroneTypeEnum.Identification),
                new("RECON-002", "Eagle Vision", "AeroTech", "EUA", DroneTypeEnum.Identification),
                new("RECON-003", "Falcon Scout", "DroneWorks", "EUA", DroneTypeEnum.Identification),
                new("RECON-004", "Hawk Surveyor", "SkyTech", "Canadá", DroneTypeEnum.Identification),
                new("RECON-005", "Condor Watch", "AviaTech", "Brasil", DroneTypeEnum.Identification),
                new("COMBAT-001", "Phoenix Tracker", "NordicDrones", "Suécia", DroneTypeEnum.Combat),
                new("COMBAT-002", "Raven Observer", "EuroFly", "Alemanha", DroneTypeEnum.Combat),
                new("COMBAT-003", "Osprey Monitor", "AsianTech", "Japão", DroneTypeEnum.Combat)
            };

            await context.Drones.AddRangeAsync(drones);
            await context.SaveChangesAsync();
        }

        if (serviceProvider != null)
        {
            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();
            if (userManager != null && !await context.Users.AnyAsync())
            {
                var defaultUser = new ApplicationUser
                {
                    UserName = "admin@primordial.com",
                    Email = "admin@primordial.com",
                    Name = "Administrador",
                    Role = UserRoleEnum.FieldAgent,
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = true
                };

                await userManager.CreateAsync(defaultUser, "Admin123!");
            }
        }
    }
}