namespace PrimordialDuckOperation.Application.DTOs.PrimordialDuck;

public class InputFilterPrimordialDuck : BaseInputFilter
{
    public string? CityName { get; set; }
    public string? Country { get; set; }
    public int? HibernationStatus { get; set; }
    public int? MinMutationCount { get; set; }
    public int? MaxMutationCount { get; set; }
    public long? SuperPowerId { get; set; }
    public bool? IsCaptured { get; set; }
}