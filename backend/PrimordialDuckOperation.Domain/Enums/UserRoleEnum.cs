using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum UserRoleEnum
{
    [EnumMember(Value = "Agente de Campo")]
    FieldAgent = 1,

    [EnumMember(Value = "Operador de Drone")]
    DroneOperator = 2,

    [EnumMember(Value = "Analista")]
    Analyst = 3,

    [EnumMember(Value = "Pesquisador")]
    Researcher = 4
}