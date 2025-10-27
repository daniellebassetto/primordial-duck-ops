namespace PrimordialDuckOperation.Application.DTOs;

public record LocationResponseDto
{
    public string CityName { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
    public decimal Latitude { get; init; }
    public decimal Longitude { get; init; }
    public string? ReferencePoint { get; init; }
}