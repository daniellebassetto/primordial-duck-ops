using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Domain.Entities;

public class SuperPower : BaseEntity<SuperPower>
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public SuperPowerClassificationEnum Classification { get; private set; }
    public virtual ICollection<PrimordialDuck> PrimordialDucks { get; set; } = new List<PrimordialDuck>();

    public SuperPower() { }

    public SuperPower(string name, string description, SuperPowerClassificationEnum classification)
    {
        Name = name;
        Description = description;
        Classification = classification;
    }

    public void UpdateClassification(SuperPowerClassificationEnum classification)
    {
        Classification = classification;
    }
}