using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.DTOs;

public class UpdateCaptureOperationDto
{
    public CaptureStatus Status { get; set; }
    public CaptureResultEnum? CaptureResult { get; set; }
}