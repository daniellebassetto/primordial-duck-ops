using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.DTOs;

public record DroneResponseDto
{
    public long Id { get; init; }
    public string SerialNumber { get; init; } = string.Empty;
    public string Brand { get; init; } = string.Empty;
    public string Manufacturer { get; init; } = string.Empty;
    public string CountryOfOrigin { get; init; } = string.Empty;
    public DroneTypeEnum Type { get; init; }
    public int BatteryLevel { get; init; }
    public int FuelLevel { get; init; }
    public int Integrity { get; init; }
    public bool IsActive { get; init; }
    public bool IsOperational { get; init; }
}