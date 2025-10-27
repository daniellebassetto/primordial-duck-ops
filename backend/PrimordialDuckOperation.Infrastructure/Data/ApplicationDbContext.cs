using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Infrastructure.Configurations;

namespace PrimordialDuckOperation.Infrastructure.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<PrimordialDuck> PrimordialDucks { get; set; }
    public DbSet<Drone> Drones { get; set; }
    public DbSet<SuperPower> SuperPowers { get; set; }
    public DbSet<CaptureOperation> CaptureOperations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new PrimordialDuckConfiguration());
        modelBuilder.ApplyConfiguration(new DroneConfiguration());
        modelBuilder.ApplyConfiguration(new SuperPowerConfiguration());
        modelBuilder.ApplyConfiguration(new CaptureOperationConfiguration());
        modelBuilder.ApplyConfiguration(new ApplicationUserConfiguration());

        base.OnModelCreating(modelBuilder);
    }
}