using System.Reflection;
using System.Runtime.Serialization;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.Services;

public class CaptureStrategyService
{
    private readonly Random _random = new();

    private readonly DefenseTypeEnum[] _availableDefenses = {
        DefenseTypeEnum.EnergyShield,
        DefenseTypeEnum.CamouflageField,
        DefenseTypeEnum.TeleportationBurst,
        DefenseTypeEnum.PsychicBarrier,
        DefenseTypeEnum.ElementalWard,
        DefenseTypeEnum.TimeDistortion,
        DefenseTypeEnum.BiologicalArmor,
        DefenseTypeEnum.QuantumReflection,
        DefenseTypeEnum.KineticAbsorption,
        DefenseTypeEnum.MagneticField,
        DefenseTypeEnum.NeuralInterference,
        DefenseTypeEnum.PlasmaDome,
        DefenseTypeEnum.DefensiveCloning,
        DefenseTypeEnum.DimensionalPrison,
        DefenseTypeEnum.AcceleratedRegeneration
    };

    public (CaptureStrategyEnum Strategy, DefenseTypeEnum DefenseGenerated, int SuccessChance, string Reasoning) GenerateStrategy(PrimordialDuck duck, Drone drone)
    {
        var strategy = AnalyzeAndCreateStrategy(duck);
        var defense = GenerateRandomDefense();
        var successChance = CalculateSuccessChance(duck, drone, strategy);
        var reasoning = GenerateReasoning(duck);

        return (strategy, defense, successChance, reasoning);
    }

    private CaptureStrategyEnum AnalyzeAndCreateStrategy(PrimordialDuck duck)
    {
        var strategies = new List<CaptureStrategyEnum>();

        if (duck.HeightInCentimeters > 100)
        {
            strategies.Add(CaptureStrategyEnum.AerialBombardment);
            strategies.Add(CaptureStrategyEnum.GravityInversion);
        }
        else if (duck.HeightInCentimeters < 30)
        {
            strategies.Add(CaptureStrategyEnum.TrapDeployment);
            strategies.Add(CaptureStrategyEnum.ContainmentNet);
        }
        else
        {
            strategies.Add(CaptureStrategyEnum.DirectAssault);
            strategies.Add(CaptureStrategyEnum.TacticalSiege);
        }

        if (duck.WeightInGrams > 5000)
        {
            strategies.Add(CaptureStrategyEnum.DirectAssault);
            strategies.Add(CaptureStrategyEnum.AreaSuppression);
        }
        else if (duck.WeightInGrams < 500)
        {
            strategies.Add(CaptureStrategyEnum.TrapDeployment);
            strategies.Add(CaptureStrategyEnum.SilentInfiltration);
        }

        switch (duck.HibernationStatus)
        {
            case HibernationStatusEnum.Awake:
                strategies.Add(CaptureStrategyEnum.DistractionTactic);
                strategies.Add(CaptureStrategyEnum.HolographicDecoy);
                strategies.Add(CaptureStrategyEnum.LightningStrike);
                break;
            case HibernationStatusEnum.InTrance:
                strategies.Add(CaptureStrategyEnum.SteathApproach);
                strategies.Add(CaptureStrategyEnum.SilentInfiltration);
                strategies.Add(CaptureStrategyEnum.SonicPulse);
                break;
            case HibernationStatusEnum.DeepHibernation:
                strategies.Add(CaptureStrategyEnum.SteathApproach);
                strategies.Add(CaptureStrategyEnum.ContainmentNet);
                break;
        }

        if (duck.MutationCount > 5)
        {
            strategies.Add(CaptureStrategyEnum.AerialBombardment);
            strategies.Add(CaptureStrategyEnum.AreaSuppression);
            strategies.Add(CaptureStrategyEnum.GravityInversion);
        }
        else if (duck.MutationCount > 2)
        {
            strategies.Add(CaptureStrategyEnum.DistractionTactic);
            strategies.Add(CaptureStrategyEnum.FlankingManeuver);
        }
        else if (duck.MutationCount > 0)
        {
            strategies.Add(CaptureStrategyEnum.TacticalSiege);
        }

        if (duck.Location.Latitude < -30)
            strategies.Add(CaptureStrategyEnum.UnderwaterAmbush);

        if (Math.Abs(duck.Location.Longitude) > 100)
            strategies.Add(CaptureStrategyEnum.FlankingManeuver);

        strategies.Add(CaptureStrategyEnum.HolographicDecoy);
        strategies.Add(CaptureStrategyEnum.SonicPulse);

        return strategies[_random.Next(strategies.Count)];
    }

    private DefenseTypeEnum GenerateRandomDefense()
    {
        return _availableDefenses[_random.Next(_availableDefenses.Length)];
    }

    private int CalculateSuccessChance(PrimordialDuck duck, Drone drone, CaptureStrategyEnum strategy)
    {
        var baseChance = 50;

        baseChance += (drone.BatteryLevel - 50) / 5;
        baseChance += (drone.FuelLevel - 50) / 5;
        baseChance += (drone.Integrity - 50) / 3;

        if (duck.HibernationStatus == HibernationStatusEnum.DeepHibernation)
            baseChance += 30;
        else if (duck.HibernationStatus == HibernationStatusEnum.InTrance)
            baseChance += 15;

        baseChance -= duck.MutationCount * 3;

        if (duck.WeightInGrams > 3000)
            baseChance -= 10;
        if (duck.HeightInCentimeters > 80)
            baseChance -= 5;

        baseChance += _random.Next(-15, 16);

        return Math.Max(5, Math.Min(95, baseChance));
    }

    private static string GenerateReasoning(PrimordialDuck duck)
    {
        var statusDescription = GetEnumMemberValue(duck.HibernationStatus) ?? "Desconhecido";
        var heightValue = duck.Height.Value;
        var heightUnit = duck.Height.Unit == HeightUnitEnum.Centimeters ? "cm" : "ft";
        var weightValue = duck.Weight.Value;
        var weightUnit = duck.Weight.Unit == WeightUnitEnum.Grams ? "g" : "lb";

        return $"Estratégia selecionada baseada em: altura {heightValue:F1}{heightUnit}, peso {weightValue:F1}{weightUnit}, " +
               $"status {statusDescription}, {duck.MutationCount} mutações. " +
               $"Sistema de defesa aleatória ativado para contrabalancear poderes especiais.";
    }

    private static string? GetEnumMemberValue<T>(T enumValue) where T : Enum
    {
        var type = enumValue.GetType();
        var memberInfo = type.GetMember(enumValue.ToString());
        if (memberInfo.Length > 0)
        {
            var attribute = memberInfo[0].GetCustomAttribute<EnumMemberAttribute>();
            if (attribute != null)
                return attribute.Value;
        }
        return enumValue.ToString();
    }

    private static string GetHibernationStatusDescription(HibernationStatusEnum status)
    {
        return status switch
        {
            HibernationStatusEnum.Awake => "Desperto",
            HibernationStatusEnum.InTrance => "Em Transe",
            HibernationStatusEnum.DeepHibernation => "Hibernação Profunda",
            _ => "Desconhecido"
        };
    }
}