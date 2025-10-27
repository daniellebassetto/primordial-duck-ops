using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Domain.Entities;

public class CaptureOperation : BaseEntity<CaptureOperation>
{
    public long PrimordialDuckId { get; private set; }
    public long DroneId { get; private set; }
    public CaptureStatus Status { get; private set; }
    public CaptureStrategyEnum Strategy { get; private set; }
    public DefenseTypeEnum DefenseGenerated { get; private set; }
    public int SuccessChance { get; private set; }
    public DateTime StartTime { get; private set; }
    public DateTime? EndTime { get; private set; }
    public CaptureResultEnum? CaptureResult { get; private set; }
    public bool IsAutoGuided { get; private set; }

    public virtual PrimordialDuck PrimordialDuck { get; private set; } = null!;
    public virtual Drone Drone { get; private set; } = null!;

    public CaptureOperation() { }

    public CaptureOperation(long primordialDuckId, long droneId, CaptureStrategyEnum strategy, DefenseTypeEnum defenseGenerated, int successChance, bool isAutoGuided = false)
    {
        PrimordialDuckId = primordialDuckId;
        DroneId = droneId;
        Strategy = strategy;
        DefenseGenerated = defenseGenerated;
        SuccessChance = successChance;
        Status = CaptureStatus.Preparing;
        StartTime = DateTime.UtcNow;
        IsAutoGuided = isAutoGuided;
    }

    public void StartOperation()
    {
        Status = CaptureStatus.InProgress;
    }

    public void CompleteOperation(CaptureResultEnum captureResult)
    {
        CaptureResult = captureResult;
        Status = captureResult == CaptureResultEnum.Success ? CaptureStatus.Success : CaptureStatus.Failed;
        EndTime = DateTime.UtcNow;
    }

    public void AbortOperation()
    {
        Status = CaptureStatus.Aborted;
        EndTime = DateTime.UtcNow;
    }
}