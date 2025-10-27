using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum HeightUnitEnum
{
    [EnumMember(Value = "Centímetros")]
    Centimeters = 1,

    [EnumMember(Value = "Pés")]
    Feet = 2
}

public enum WeightUnitEnum
{
    [EnumMember(Value = "Gramas")]
    Grams = 1,

    [EnumMember(Value = "Libras")]
    Pounds = 2
}

public enum PrecisionUnitEnum
{
    [EnumMember(Value = "Centímetros")]
    Centimeters = 1,

    [EnumMember(Value = "Metros")]
    Meters = 2,

    [EnumMember(Value = "Jardas")]
    Yards = 3
}