namespace PrimordialDuckOperation.Domain.ValueObjects;

public class CombatStrategy
{
    public string AttackPlan { get; set; } = string.Empty;
    public string WeakPoint { get; set; } = string.Empty;
    public string DefenseSystem { get; set; } = string.Empty;
    public int SuccessChance { get; set; }
    public List<string> RequiredEquipment { get; set; } = [];
    public List<string> Tactics { get; set; } = [];
}