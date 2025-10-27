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
    TimeDistortion = 6,

    [EnumMember(Value = "Armadura Biológica")]
    BiologicalArmor = 7,

    [EnumMember(Value = "Reflexão Quântica")]
    QuantumReflection = 8,

    [EnumMember(Value = "Absorção Cinética")]
    KineticAbsorption = 9,

    [EnumMember(Value = "Campo Magnético")]
    MagneticField = 10,

    [EnumMember(Value = "Interferência Neural")]
    NeuralInterference = 11,

    [EnumMember(Value = "Cúpula de Plasma")]
    PlasmaDome = 12,

    [EnumMember(Value = "Clonagem Defensiva")]
    DefensiveCloning = 13,

    [EnumMember(Value = "Prisão Dimensional")]
    DimensionalPrison = 14,

    [EnumMember(Value = "Regeneração Acelerada")]
    AcceleratedRegeneration = 15
}