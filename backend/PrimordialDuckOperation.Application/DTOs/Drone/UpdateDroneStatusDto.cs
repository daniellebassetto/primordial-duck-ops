namespace PrimordialDuckOperation.Application.DTOs;

public class UpdateDroneStatusDto
{
    public int BatteryLevel { get; set; }
    public int FuelLevel { get; set; }
    public int Integrity { get; set; }
}