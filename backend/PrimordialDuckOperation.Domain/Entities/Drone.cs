using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Domain.Entities;

public class Drone : BaseEntity<Drone>
{
    public string SerialNumber { get; private set; } = string.Empty;
    public string Brand { get; private set; } = string.Empty;
    public string Manufacturer { get; private set; } = string.Empty;
    public string CountryOfOrigin { get; private set; } = string.Empty;
    public DroneTypeEnum Type { get; private set; }
    public int BatteryLevel { get; private set; }
    public int FuelLevel { get; private set; }
    public int Integrity { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime LastMaintenance { get; private set; }
    public virtual ICollection<PrimordialDuck> PrimordialDucks { get; set; } = [];

    public Drone() { }

    public Drone(string serialNumber, string brand, string manufacturer, string countryOfOrigin, DroneTypeEnum type)
    {
        SerialNumber = serialNumber;
        Brand = brand;
        Manufacturer = manufacturer;
        CountryOfOrigin = countryOfOrigin;
        Type = type;
        BatteryLevel = 100;
        FuelLevel = 100;
        Integrity = 100;
        IsActive = true;
        LastMaintenance = DateTime.UtcNow;
    }

    public void Update(string serialNumber, string brand, string manufacturer, string countryOfOrigin)
    {
        SerialNumber = serialNumber;
        Brand = brand;
        Manufacturer = manufacturer;
        CountryOfOrigin = countryOfOrigin;
    }

    public void UpdateStatus(int battery, int fuel, int integrity)
    {
        BatteryLevel = Math.Max(0, Math.Min(100, battery));
        FuelLevel = Math.Max(0, Math.Min(100, fuel));
        Integrity = Math.Max(0, Math.Min(100, integrity));
        LastMaintenance = DateTime.UtcNow;
    }

    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;

    public bool IsOperational => BatteryLevel > 10 && FuelLevel > 5 && Integrity > 20;
}