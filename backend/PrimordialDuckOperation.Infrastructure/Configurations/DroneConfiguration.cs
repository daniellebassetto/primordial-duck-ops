using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrimordialDuckOperation.Domain.Entities;

namespace PrimordialDuckOperation.Infrastructure.Configurations;

public class DroneConfiguration : IEntityTypeConfiguration<Drone>
{
    public void Configure(EntityTypeBuilder<Drone> builder)
    {
        builder.ToTable("drones");

        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id).HasColumnName("id");

        builder.Property(d => d.SerialNumber)
            .HasColumnName("numero_serie")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(d => d.Brand)
            .HasColumnName("marca")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(d => d.Manufacturer)
            .HasColumnName("fabricante")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(d => d.CountryOfOrigin)
            .HasColumnName("pais_origem")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(d => d.Type)
            .HasColumnName("tipo")
            .HasConversion<int>()
            .IsRequired();

        builder.Property(d => d.BatteryLevel)
            .HasColumnName("nivel_bateria")
            .IsRequired();

        builder.Property(d => d.FuelLevel)
            .HasColumnName("nivel_combustivel")
            .IsRequired();

        builder.Property(d => d.Integrity)
            .HasColumnName("integridade")
            .IsRequired();

        builder.Property(d => d.IsActive)
            .HasColumnName("ativo")
            .IsRequired();

        builder.Property(d => d.LastMaintenance)
            .HasColumnName("ultima_manutencao")
            .IsRequired();

        builder.Property(d => d.CreationDate)
            .HasColumnName("data_criacao")
            .IsRequired();

        builder.Property(d => d.ChangeDate)
            .HasColumnName("data_alteracao");

        builder.HasIndex(d => d.SerialNumber).IsUnique();
    }
}