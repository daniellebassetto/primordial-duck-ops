using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum CaptureStrategyEnum
{
    [EnumMember(Value = "Aproximação Furtiva")]
    SteathApproach = 1,

    [EnumMember(Value = "Assalto Direto")]
    DirectAssault = 2,

    [EnumMember(Value = "Armadilha Estratégica")]
    TrapDeployment = 3,

    [EnumMember(Value = "Tática de Distração")]
    DistractionTactic = 4,

    [EnumMember(Value = "Bombardeio Aéreo")]
    AerialBombardment = 5,

    [EnumMember(Value = "Emboscada Aquática")]
    UnderwaterAmbush = 6
}