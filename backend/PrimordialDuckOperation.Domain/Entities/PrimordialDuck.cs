using PrimordialDuckOperation.Domain.Enums;
using PrimordialDuckOperation.Domain.ValueObjects;

namespace PrimordialDuckOperation.Domain.Entities;

public class PrimordialDuck : BaseEntity<PrimordialDuck>
{
    public string Name { get; private set; } = string.Empty;
    public string? Nickname { get; private set; }
    public string Species { get; private set; } = string.Empty;
    public long DroneId { get; private set; }
    public HeightMeasurement Height { get; private set; } = null!;
    public WeightMeasurement Weight { get; private set; } = null!;
    public Location Location { get; private set; } = null!;
    public PrecisionMeasurement GpsPrecision { get; private set; } = null!;
    public HibernationStatusEnum HibernationStatus { get; private set; }
    public int? HeartRate { get; private set; }
    public int MutationCount { get; private set; }
    public long? SuperPowerId { get; private set; }
    public DateTime DiscoveredAt { get; private set; }

    public virtual Drone Drone { get; private set; } = null!;
    public virtual SuperPower? SuperPower { get; private set; }
    public virtual ICollection<CaptureOperation> CaptureOperations { get; private set; } = [];

    public bool IsCaptured => CaptureOperations.Any(c => c.CaptureResult == Enums.CaptureResultEnum.Success);
    public DateTime? CaptureDate => CaptureOperations.Where(c => c.CaptureResult == Enums.CaptureResultEnum.Success).OrderByDescending(c => c.EndTime).FirstOrDefault()?.EndTime;
    public bool CanBeCaptured => !IsCaptured;


    public PrimordialDuck() { }

    public PrimordialDuck(
        long droneId,
        HeightMeasurement height,
        WeightMeasurement weight,
        Location location,
        PrecisionMeasurement gpsPrecision,
        HibernationStatusEnum hibernationStatus,
        int mutationCount,
        int? heartRate = null,
        long? superPowerId = null,
        string? nickName = null)
    {
        DroneId = droneId;
        Height = height;
        Weight = weight;
        Location = location;
        GpsPrecision = gpsPrecision;
        HibernationStatus = hibernationStatus;
        MutationCount = mutationCount;
        HeartRate = heartRate;
        SuperPowerId = superPowerId;
        DiscoveredAt = DateTime.UtcNow;
        Nickname = nickName;
    }

    public void UpdateHeartRate(int heartRate)
    {
        HeartRate = heartRate;
    }

    public void AssignSuperPower(long superPowerId)
    {
        SuperPowerId = superPowerId;
    }

    public bool IsAwake => HibernationStatus == HibernationStatusEnum.Awake;
    public bool HasSuperPower => SuperPowerId.HasValue;
    public decimal HeightInCentimeters => Height.ToCentimeters();
    public decimal WeightInGrams => Weight.ToGrams();
    public decimal PrecisionInCentimeters => GpsPrecision.ToCentimeters();

}