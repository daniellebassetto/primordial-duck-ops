using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum DefenseTypeEnum
{
    [EnumMember(Value = "Escudo de Energia")]
    EnergyShield = 1,

    [EnumMember(Value = "Campo de Camuflagem")]
    CamouflageField = 2,

    [EnumMember(Value = "Rajada de Teletransporte")]
    TeleportationBurst = 3,

    [EnumMember(Value = "Barreira Psíquica")]
    PsychicBarrier = 4,

    [EnumMember(Value = "Proteção Elemental")]
    ElementalWard = 5,

    [EnumMember(Value = "Distorção Temporal")]
    TimeDistortion = 6
}