using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.DTOs;

public class CaptureOperationResponseDto
{
    public long Id { get; set; }
    public long PrimordialDuckId { get; set; }
    public long DroneId { get; set; }
    public CaptureStatus Status { get; set; }
    public string Strategy { get; set; } = string.Empty;
    public string DefenseGenerated { get; set; } = string.Empty;
    public int SuccessChance { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Result { get; set; }
    public CaptureResultEnum? CaptureResult { get; set; }
    public bool IsAutoGuided { get; set; }
    public DroneResponseDto? Drone { get; set; }
    public PrimordialDuckResponseDto? PrimordialDuck { get; set; }
}