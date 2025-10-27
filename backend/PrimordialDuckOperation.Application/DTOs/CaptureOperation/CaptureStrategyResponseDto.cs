namespace PrimordialDuckOperation.Application.DTOs;

public class CaptureStrategyResponseDto
{
    public string Strategy { get; set; } = string.Empty;
    public string DefenseGenerated { get; set; } = string.Empty;
    public int SuccessChance { get; set; }
    public string Reasoning { get; set; } = string.Empty;
}