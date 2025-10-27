using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrimordialDuckOperation.Domain.Entities;

namespace PrimordialDuckOperation.Infrastructure.Configurations;

public class CaptureOperationConfiguration : IEntityTypeConfiguration<CaptureOperation>
{
    public void Configure(EntityTypeBuilder<CaptureOperation> builder)
    {
        builder.ToTable("operacoes_captura");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");

        builder.Property(c => c.PrimordialDuckId).HasColumnName("id_pato_primordial").IsRequired();
        builder.Property(c => c.DroneId).HasColumnName("id_drone").IsRequired();
        builder.Property(c => c.Status).HasColumnName("status").IsRequired();
        builder.Property(c => c.Strategy).HasColumnName("estrategia").IsRequired();
        builder.Property(c => c.DefenseGenerated).HasColumnName("defesa_gerada").IsRequired();
        builder.Property(c => c.SuccessChance).HasColumnName("chance_sucesso").IsRequired();
        builder.Property(c => c.StartTime).HasColumnName("inicio").IsRequired();
        builder.Property(c => c.EndTime).HasColumnName("fim");
        builder.Property(c => c.CaptureResult).HasColumnName("resultado_captura");
        builder.Property(c => c.IsAutoGuided).HasColumnName("guiado_automaticamente").IsRequired();

        builder.Property(c => c.CreationDate)
            .HasColumnName("data_criacao")
            .IsRequired();

        builder.Property(c => c.ChangeDate)
            .HasColumnName("data_alteracao");

        builder.HasOne(c => c.PrimordialDuck)
            .WithMany(p => p.CaptureOperations)
            .HasForeignKey(c => c.PrimordialDuckId)
            .HasConstraintName("FK_operacoes_captura_patos_primordiais")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Drone)
            .WithMany()
            .HasForeignKey(c => c.DroneId)
            .HasConstraintName("FK_operacoes_captura_drones")
            .OnDelete(DeleteBehavior.Restrict);


    }
}