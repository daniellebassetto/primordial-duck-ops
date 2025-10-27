using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.DTOs;

public class InputFilterCaptureOperation : BaseInputFilter
{
    public CaptureStatus? Status { get; set; }
    public long? PrimordialDuckId { get; set; }
    public long? DroneId { get; set; }
    public DateTime? StartDateFrom { get; set; }
    public DateTime? StartDateTo { get; set; }
    public int? MinSuccessChance { get; set; }
    public int? MaxSuccessChance { get; set; }
}