using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.DTOs;

public record SuperPowerResponseDto
{
    public long Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public SuperPowerClassificationEnum Classification { get; init; }
}