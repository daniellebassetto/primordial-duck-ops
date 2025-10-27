using System.Runtime.Serialization;

namespace PrimordialDuckOperation.Domain.Enums;

public enum HibernationStatusEnum
{
    [EnumMember(Value = "Desperto")]
    Awake = 1,

    [EnumMember(Value = "Em Transe")]
    InTrance = 2,

    [EnumMember(Value = "Hibernação Profunda")]
    DeepHibernation = 3
}