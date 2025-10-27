using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.DTOs;

public record PrimordialDuckResponseDto
{
    public long Id { get; init; }
    public string? Nickname { get; init; }
    public DroneResponseDto? Drone { get; init; } = null!;
    public decimal HeightValue { get; init; }
    public HeightUnitEnum HeightUnit { get; init; }
    public decimal WeightValue { get; init; }
    public WeightUnitEnum WeightUnit { get; init; }
    public LocationResponseDto Location { get; init; } = null!;
    public decimal GpsPrecisionValue { get; init; }
    public PrecisionUnitEnum GpsPrecisionUnit { get; init; }
    public HibernationStatusEnum HibernationStatus { get; init; }
    public int? HeartRate { get; init; }
    public int MutationCount { get; init; }
    public SuperPowerResponseDto? SuperPower { get; init; }
    public DateTime DiscoveredAt { get; init; }
    public bool IsCaptured { get; init; }
    public DateTime? CaptureDate { get; init; }
}
