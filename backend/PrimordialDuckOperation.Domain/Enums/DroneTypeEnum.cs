using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum DroneTypeEnum
{
    [EnumMember(Value = "Identifica��o")]
    Identification = 1,

    [EnumMember(Value = "Combate")]
    Combat = 2
}