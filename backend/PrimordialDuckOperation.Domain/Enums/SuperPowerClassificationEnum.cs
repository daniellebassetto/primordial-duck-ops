using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum SuperPowerClassificationEnum
{
    [EnumMember(Value = "Bélico")]
    Warlike = 1,

    [EnumMember(Value = "Defensivo")]
    Defensive = 2,

    [EnumMember(Value = "Elemental")]
    Elemental = 3,

    [EnumMember(Value = "Psíquico")]
    Psychic = 4,

    [EnumMember(Value = "Tecnológico")]
    Technological = 5,

    [EnumMember(Value = "Biológico")]
    Biological = 6,

    [EnumMember(Value = "Temporal")]
    Temporal = 7,

    [EnumMember(Value = "Dimensional")]
    Dimensional = 8
}