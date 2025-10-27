using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrimordialDuckOperation.Domain.Entities;

namespace PrimordialDuckOperation.Infrastructure.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.Role)
            .HasColumnName("funcao")
            .IsRequired();

        builder.Property(u => u.CreatedAt)
            .HasColumnName("data_criacao")
            .IsRequired();
    }
}