using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum CaptureResultEnum
{
    [EnumMember(Value = "Sucesso")]
    Success = 1,

    [EnumMember(Value = "Escapou")]
    Escaped = 2,

    [EnumMember(Value = "Falhou")]
    Failed = 3,

    [EnumMember(Value = "Drone Destruído")]
    DroneDestroyed = 4
}