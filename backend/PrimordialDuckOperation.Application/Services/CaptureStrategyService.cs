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
        DefenseTypeEnum.TimeDistortion
    };

    public (CaptureStrategyEnum Strategy, DefenseTypeEnum DefenseGenerated, int SuccessChance, string Reasoning) GenerateStrategy(PrimordialDuck duck, Drone drone)
    {
        var strategy = AnalyzeAndCreateStrategy(duck);
        var defense = GenerateRandomDefense();
        var successChance = CalculateSuccessChance(duck, drone, strategy);
        var reasoning = GenerateReasoning(duck, strategy, defense);

        return (strategy, defense, successChance, reasoning);
    }

    private CaptureStrategyEnum AnalyzeAndCreateStrategy(PrimordialDuck duck)
    {
        var strategies = new List<CaptureStrategyEnum>();

        if (duck.HeightInCentimeters > 100)
            strategies.Add(CaptureStrategyEnum.AerialBombardment);
        else if (duck.HeightInCentimeters < 30)
            strategies.Add(CaptureStrategyEnum.TrapDeployment);
        else
            strategies.Add(CaptureStrategyEnum.DirectAssault);

        if (duck.WeightInGrams > 5000)
            strategies.Add(CaptureStrategyEnum.DirectAssault);
        else if (duck.WeightInGrams < 500)
            strategies.Add(CaptureStrategyEnum.TrapDeployment);

        switch (duck.HibernationStatus)
        {
            case HibernationStatusEnum.Awake:
                strategies.Add(CaptureStrategyEnum.DistractionTactic);
                break;
            case HibernationStatusEnum.InTrance:
                strategies.Add(CaptureStrategyEnum.SteathApproach);
                break;
            case HibernationStatusEnum.DeepHibernation:
                strategies.Add(CaptureStrategyEnum.SteathApproach);
                break;
        }

        if (duck.MutationCount > 5)
            strategies.Add(CaptureStrategyEnum.AerialBombardment);
        else if (duck.MutationCount > 0)
            strategies.Add(CaptureStrategyEnum.DistractionTactic);

        if (duck.Location.Latitude < 0)
            strategies.Add(CaptureStrategyEnum.UnderwaterAmbush);

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

    private static string GenerateReasoning(PrimordialDuck duck, CaptureStrategyEnum strategy, DefenseTypeEnum defense)
    {
        return $"Estratégia selecionada baseada em: altura {duck.HeightInCentimeters:F1}cm, peso {duck.WeightInGrams:F1}g, " +
               $"status {duck.HibernationStatus}, {duck.MutationCount} mutações. " +
               $"Sistema de defesa aleatória ativado para contrabalancear poderes especiais.";
    }
}