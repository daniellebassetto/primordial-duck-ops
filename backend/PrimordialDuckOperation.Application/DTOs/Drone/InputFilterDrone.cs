using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.DTOs.Drone;

public class InputFilterDrone : BaseInputFilter
{
    public string? SerialNumber { get; set; }
    public string? Brand { get; set; }
    public string? Manufacturer { get; set; }
    public string? CountryOfOrigin { get; set; }
    public DroneTypeEnum? Type { get; set; }
}