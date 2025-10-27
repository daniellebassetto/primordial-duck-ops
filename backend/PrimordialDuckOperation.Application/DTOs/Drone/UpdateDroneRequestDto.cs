namespace PrimordialDuckOperation.Application.DTOs;

public class UpdateDroneRequestDto
{
    public string SerialNumber { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string CountryOfOrigin { get; set; } = string.Empty;
}