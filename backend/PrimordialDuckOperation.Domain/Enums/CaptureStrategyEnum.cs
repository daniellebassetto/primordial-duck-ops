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
    UnderwaterAmbush = 6,

    [EnumMember(Value = "Cerco Tático")]
    TacticalSiege = 7,

    [EnumMember(Value = "Infiltração Silenciosa")]
    SilentInfiltration = 8,

    [EnumMember(Value = "Ataque Relâmpago")]
    LightningStrike = 9,

    [EnumMember(Value = "Manobra Envolvente")]
    FlankingManeuver = 10,

    [EnumMember(Value = "Supressão de Área")]
    AreaSuppression = 11,

    [EnumMember(Value = "Isca Holográfica")]
    HolographicDecoy = 12,

    [EnumMember(Value = "Pulso Sônico")]
    SonicPulse = 13,

    [EnumMember(Value = "Rede de Contenção")]
    ContainmentNet = 14,

    [EnumMember(Value = "Inversão Gravitacional")]
    GravityInversion = 15
}