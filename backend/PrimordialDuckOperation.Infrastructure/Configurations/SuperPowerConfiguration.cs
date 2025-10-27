using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrimordialDuckOperation.Domain.Entities;

namespace PrimordialDuckOperation.Infrastructure.Configurations;

public class SuperPowerConfiguration : IEntityTypeConfiguration<SuperPower>
{
    public void Configure(EntityTypeBuilder<SuperPower> builder)
    {
        builder.ToTable("super_poderes");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");

        builder.Property(s => s.Name)
            .HasColumnName("nome")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(s => s.Description)
            .HasColumnName("descricao")
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(s => s.Classification)
            .HasColumnName("classificacao")
            .HasConversion<int>();

        builder.Property(s => s.CreationDate)
            .HasColumnName("data_criacao")
            .IsRequired();

        builder.Property(s => s.ChangeDate)
            .HasColumnName("data_alteracao");
    }
}