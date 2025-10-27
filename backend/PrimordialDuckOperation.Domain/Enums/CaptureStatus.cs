using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum CaptureStatus
{
    [EnumMember(Value = "Em preparação")]
    Preparing = 1,

    [EnumMember(Value = "Em andamento")]
    InProgress = 2,

    [EnumMember(Value = "Sucesso")]
    Success = 3,

    [EnumMember(Value = "Fracassou")]
    Failed = 4,

    [EnumMember(Value = "Cancelada")]
    Aborted = 5
}