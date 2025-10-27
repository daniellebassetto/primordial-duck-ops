using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrimordialDuckOperation.Domain.Entities;

namespace PrimordialDuckOperation.Infrastructure.Configurations;

public class PrimordialDuckConfiguration : IEntityTypeConfiguration<PrimordialDuck>
{
    public void Configure(EntityTypeBuilder<PrimordialDuck> builder)
    {
        builder.ToTable("patos_primordiais");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");

        builder.Property(p => p.DroneId).HasColumnName("id_drone").IsRequired();

        builder.Property(p => p.Nickname)
            .HasColumnName("apelido")
            .HasMaxLength(100);

        builder.OwnsOne(p => p.Height, height =>
        {
            height.Property(h => h.Value).HasColumnName("altura_valor").HasColumnType("decimal(10,2)").IsRequired();
            height.Property(h => h.Unit).HasColumnName("altura_unidade").IsRequired();
        });

        builder.OwnsOne(p => p.Weight, weight =>
        {
            weight.Property(w => w.Value).HasColumnName("peso_valor").HasColumnType("decimal(10,2)").IsRequired();
            weight.Property(w => w.Unit).HasColumnName("peso_unidade").IsRequired();
        });

        builder.OwnsOne(p => p.Location, location =>
        {
            location.Property(l => l.CityName).HasColumnName("cidade").HasMaxLength(200).IsRequired();
            location.Property(l => l.Country).HasColumnName("pais").HasMaxLength(100).IsRequired();
            location.Property(l => l.Latitude).HasColumnName("latitude").HasColumnType("decimal(20,10)").IsRequired();
            location.Property(l => l.Longitude).HasColumnName("longitude").HasColumnType("decimal(20,10)").IsRequired();
            location.Property(l => l.ReferencePoint).HasColumnName("ponto_referencia").HasMaxLength(300);
        });

        builder.OwnsOne(p => p.GpsPrecision, precision =>
        {
            precision.Property(gp => gp.Value).HasColumnName("precisao_gps_valor").HasColumnType("decimal(10,2)").IsRequired();
            precision.Property(gp => gp.Unit).HasColumnName("precisao_gps_unidade").IsRequired();
        });

        builder.Property(p => p.HibernationStatus)
            .HasColumnName("status_hibernacao")
            .IsRequired();

        builder.Property(p => p.HeartRate)
            .HasColumnName("batimentos_cardiacos");

        builder.Property(p => p.MutationCount)
            .HasColumnName("quantidade_mutacoes")
            .IsRequired();

        builder.Property(p => p.SuperPowerId)
            .HasColumnName("id_super_poder");

        builder.Property(p => p.DiscoveredAt)
            .HasColumnName("data_descoberta")
            .IsRequired();

        builder.Property(p => p.CreationDate)
            .HasColumnName("data_criacao")
            .IsRequired();

        builder.Property(p => p.ChangeDate)
            .HasColumnName("data_alteracao");

        builder.HasOne(p => p.Drone)
            .WithMany(d => d.PrimordialDucks)
            .HasForeignKey(p => p.DroneId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.SuperPower)
            .WithMany(s => s.PrimordialDucks)
            .HasForeignKey(p => p.SuperPowerId)
            .OnDelete(DeleteBehavior.SetNull);


    }
}