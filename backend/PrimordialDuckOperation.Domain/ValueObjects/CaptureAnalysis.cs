namespace PrimordialDuckOperation.Domain.ValueObjects;

public class CaptureAnalysis
{
    public int OperationalCost { get; set; }
    public int MilitaryPower { get; set; }
    public int RiskLevel { get; set; }
    public int ScientificValue { get; set; }
    public int OverallScore { get; set; }
    public decimal DistanceFromBase { get; set; }
    public string Classification { get; set; } = string.Empty;
    public List<string> RiskFactors { get; set; } = [];
    public List<string> ValueFactors { get; set; } = [];
}