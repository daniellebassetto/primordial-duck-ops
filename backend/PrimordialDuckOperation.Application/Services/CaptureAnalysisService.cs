using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;
using PrimordialDuckOperation.Domain.ValueObjects;

namespace PrimordialDuckOperation.Application.Services;

public class CaptureAnalysisService
{
    private const decimal DSIN_LAT = -22.23346927395992m;
    private const decimal DSIN_LNG = -49.934162215340926m;

    public static CaptureAnalysis AnalyzeCaptureOperation(PrimordialDuck duck)
    {
        var distance = CalculateDistance(duck.Location.Latitude, duck.Location.Longitude);

        var analysis = new CaptureAnalysis
        {
            OperationalCost = CalculateOperationalCost(duck),
            MilitaryPower = CalculateMilitaryPower(duck),
            RiskLevel = CalculateRiskLevel(duck),
            ScientificValue = CalculateScientificValue(duck),
            DistanceFromBase = distance
        };

        var costPenalty = analysis.OperationalCost > 80 ? analysis.OperationalCost * 0.4m : analysis.OperationalCost * 0.25m;
        var riskPenalty = analysis.RiskLevel > 70 ? analysis.RiskLevel * 0.6m : analysis.RiskLevel * 0.35m;
        var militaryPenalty = analysis.MilitaryPower * 0.3m;

        var capturabilityBonus = duck.HibernationStatus switch
        {
            HibernationStatusEnum.DeepHibernation => 35m,
            HibernationStatusEnum.InTrance => 20m,
            HibernationStatusEnum.Awake => -25m,
            _ => 0m
        };

        var baseScore = analysis.ScientificValue * 1.2m;
        var rawScore = baseScore + capturabilityBonus - riskPenalty - militaryPenalty - (costPenalty / 2);
        analysis.OverallScore = (int)Math.Max(1, Math.Min(100, rawScore));

        analysis.Classification = GetClassification(analysis.OverallScore);
        analysis.RiskFactors = GenerateRiskFactors(duck);
        analysis.ValueFactors = GenerateValueFactors(duck);

        return analysis;
    }

    private static int CalculateOperationalCost(PrimordialDuck duck)
    {
        var cost = 15;

        var heightCm = duck.Height.ToCentimeters();
        var weightG = duck.Weight.ToGrams();
        var precisionCm = duck.GpsPrecision.ToCentimeters();

        cost += heightCm switch
        {
            > 3000 => 45,
            > 1500 => 35,
            > 800 => 25,
            > 300 => 15,
            > 150 => 10,
            _ => 5
        };


        cost += weightG switch
        {
            > 250000 => 40,
            > 150000 => 30,
            > 80000 => 20,
            > 30000 => 15,
            > 15000 => 10,
            _ => 5
        };


        var distance = CalculateDistance(duck.Location.Latitude, duck.Location.Longitude);
        cost += distance switch
        {
            > 5000 => 35,
            > 2000 => 25,
            > 1000 => 18,
            > 500 => 12,
            > 200 => 8,
            > 50 => 4,
            _ => 1
        };


        cost += precisionCm switch
        {
            > 2000 => 20,
            > 1000 => 15,
            > 500 => 12,
            > 100 => 8,
            > 50 => 5,
            > 20 => 3,
            _ => 1
        };


        cost += duck.MutationCount switch
        {
            >= 10 => duck.MutationCount * 3,
            >= 5 => duck.MutationCount * 2,
            >= 1 => duck.MutationCount * 1,
            _ => 0
        };


        if (duck.SuperPower != null)
        {
            cost += duck.SuperPower.Classification switch
            {
                SuperPowerClassificationEnum.Temporal => 25,
                SuperPowerClassificationEnum.Dimensional => 22,
                SuperPowerClassificationEnum.Psychic => 18,
                SuperPowerClassificationEnum.Technological => 15,
                SuperPowerClassificationEnum.Warlike => 12,
                SuperPowerClassificationEnum.Elemental => 10,
                SuperPowerClassificationEnum.Biological => 8,
                SuperPowerClassificationEnum.Defensive => 5,
                _ => 3
            };
        }


        cost += duck.HibernationStatus switch
        {
            HibernationStatusEnum.Awake => 30,
            HibernationStatusEnum.InTrance => 15,
            HibernationStatusEnum.DeepHibernation => 5,
            _ => 0
        };

        return Math.Min(100, cost);
    }

    private static int CalculateMilitaryPower(PrimordialDuck duck)
    {
        var power = 10;


        var heightCm = duck.Height.ToCentimeters();
        var weightG = duck.Weight.ToGrams();

        power += (heightCm, weightG) switch
        {
            ( > 2000, > 200000) => 30,
            ( > 1000, > 100000) => 25,
            ( > 500, > 50000) => 20,
            ( > 300, > 30000) => 15,
            ( > 150, > 15000) => 10,
            _ => 5
        };


        var hibernationMultiplier = duck.HibernationStatus switch
        {
            HibernationStatusEnum.Awake => 3.0m,
            HibernationStatusEnum.InTrance => GetTranceMultiplier(duck.HeartRate),
            HibernationStatusEnum.DeepHibernation => 0.3m,
            _ => 1.0m
        };

        power = (int)(power * hibernationMultiplier);


        if (duck.SuperPower != null)
        {
            var superPowerBonus = duck.SuperPower.Classification switch
            {
                SuperPowerClassificationEnum.Warlike => 35,
                SuperPowerClassificationEnum.Dimensional => 30,
                SuperPowerClassificationEnum.Temporal => 28,
                SuperPowerClassificationEnum.Psychic => 25,
                SuperPowerClassificationEnum.Elemental => 22,
                SuperPowerClassificationEnum.Technological => 18,
                SuperPowerClassificationEnum.Biological => 15,
                SuperPowerClassificationEnum.Defensive => 8,
                _ => 5
            };


            if (duck.HibernationStatus == HibernationStatusEnum.Awake)
                superPowerBonus = (int)(superPowerBonus * 1.5m);
            else if (duck.HibernationStatus == HibernationStatusEnum.InTrance)
                superPowerBonus = (int)(superPowerBonus * 0.7m);
            else
                superPowerBonus = (int)(superPowerBonus * 0.2m);

            power += superPowerBonus;
        }


        power += duck.MutationCount switch
        {
            >= 8 => duck.MutationCount * 5,
            >= 5 => duck.MutationCount * 4,
            >= 3 => duck.MutationCount * 3,
            >= 1 => duck.MutationCount * 2,
            _ => 0
        };

        return Math.Min(100, power);
    }

    private static decimal GetTranceMultiplier(int? heartRate)
    {
        if (!heartRate.HasValue)
            return 1.0m;

        return heartRate.Value switch
        {
            > 150 => 2.2m,
            > 100 => 1.8m,
            > 60 => 1.4m,
            > 30 => 1.0m,
            _ => 0.6m
        };
    }

    private static int CalculateRiskLevel(PrimordialDuck duck)
    {
        var risk = 5;


        risk += duck.HibernationStatus switch
        {
            HibernationStatusEnum.Awake => 45,
            HibernationStatusEnum.InTrance => CalculateTrancerisk(duck.HeartRate),
            HibernationStatusEnum.DeepHibernation => 2,
            _ => 10
        };


        if (duck.SuperPower != null)
        {
            var powerRisk = duck.SuperPower.Classification switch
            {
                SuperPowerClassificationEnum.Warlike => 25,
                SuperPowerClassificationEnum.Temporal => 22,
                SuperPowerClassificationEnum.Dimensional => 20,
                SuperPowerClassificationEnum.Psychic => 18,
                SuperPowerClassificationEnum.Elemental => 15,
                SuperPowerClassificationEnum.Technological => 12,
                SuperPowerClassificationEnum.Biological => 10,
                SuperPowerClassificationEnum.Defensive => 5,
                _ => 3
            };


            if (duck.HibernationStatus == HibernationStatusEnum.DeepHibernation)
                powerRisk = (int)(powerRisk * 0.3m);
            else if (duck.HibernationStatus == HibernationStatusEnum.InTrance)
                powerRisk = (int)(powerRisk * 0.6m);

            risk += powerRisk;
        }


        risk += duck.MutationCount switch
        {
            10 => 30,
            >= 8 => 25,
            >= 6 => 20,
            >= 4 => 15,
            >= 3 => 10,
            >= 1 => 5,
            _ => 0
        };


        var heightCm = duck.Height.ToCentimeters();
        risk += heightCm switch
        {
            > 3000 => 18,
            > 1500 => 15,
            > 800 => 12,
            > 400 => 8,
            > 200 => 5,
            _ => 0
        };


        var distance = CalculateDistance(duck.Location.Latitude, duck.Location.Longitude);
        risk += distance switch
        {
            > 3000 => 10,
            > 1500 => 6,
            > 500 => 3,
            _ => 0
        };


        var precisionCm = duck.GpsPrecision.ToCentimeters();
        risk += precisionCm switch
        {
            > 2000 => 10,
            > 1000 => 7,
            > 500 => 5,
            > 200 => 3,
            > 100 => 1,
            _ => 0
        };

        return Math.Min(100, risk);
    }

    private static int CalculateTrancerisk(int? heartRate)
    {
        if (!heartRate.HasValue)
            return 15;

        return heartRate.Value switch
        {
            > 200 => 35,
            > 150 => 30,
            > 100 => 25,
            > 80 => 20,
            > 60 => 15,
            > 40 => 10,
            > 20 => 5,
            _ => 2
        };
    }

    private static int CalculateScientificValue(PrimordialDuck duck)
    {
        var value = 20;


        value += duck.MutationCount switch
        {
            10 => 45,
            >= 8 => 40,
            >= 6 => 35,
            >= 5 => 30,
            >= 4 => 25,
            >= 3 => 20,
            >= 2 => 15,
            1 => 8,
            _ => 0
        };


        if (duck.SuperPower != null)
        {
            value += duck.SuperPower.Classification switch
            {
                SuperPowerClassificationEnum.Temporal => 30,
                SuperPowerClassificationEnum.Dimensional => 28,
                SuperPowerClassificationEnum.Psychic => 20,
                SuperPowerClassificationEnum.Technological => 18,
                SuperPowerClassificationEnum.Biological => 15,
                SuperPowerClassificationEnum.Elemental => 12,
                SuperPowerClassificationEnum.Warlike => 8,
                SuperPowerClassificationEnum.Defensive => 10,
                _ => 5
            };
        }


        value += duck.HibernationStatus switch
        {
            HibernationStatusEnum.DeepHibernation => 20,
            HibernationStatusEnum.InTrance => GetTranceScientificValue(duck.HeartRate),
            HibernationStatusEnum.Awake => 5,
            _ => 0
        };


        var heightCm = duck.Height.ToCentimeters();
        var weightG = duck.Weight.ToGrams();


        if (heightCm > 4000 || heightCm < 100)
            value += 15;
        else if (heightCm > 2500 || heightCm < 120)
            value += 10;
        else if (heightCm > 1500 || heightCm < 150)
            value += 5;

        if (weightG > 300000 || weightG < 8000)
            value += 12;
        else if (weightG > 200000 || weightG < 12000)
            value += 8;
        else if (weightG > 150000 || weightG < 20000)
            value += 4;


        var precisionCm = duck.GpsPrecision.ToCentimeters();
        value += precisionCm switch
        {
            <= 10 => 10,
            <= 25 => 8,
            <= 50 => 6,
            <= 150 => 4,
            <= 500 => 2,
            _ => 0
        };


        if (duck.MutationCount >= 10 && duck.SuperPower != null)
            value += 12;
        else if (duck.MutationCount >= 8 && duck.SuperPower != null)
            value += 8;

        if (duck.HibernationStatus == HibernationStatusEnum.DeepHibernation && duck.MutationCount >= 8)
            value += 10;
        else if (duck.HibernationStatus == HibernationStatusEnum.DeepHibernation && duck.MutationCount >= 5)
            value += 6;

        return Math.Min(100, value);
    }

    private static int GetTranceScientificValue(int? heartRate)
    {
        if (!heartRate.HasValue)
            return 10;

        return heartRate.Value switch
        {
            <= 10 => 15,
            <= 30 => 12,
            <= 60 => 8,
            <= 100 => 5,
            _ => 2
        };
    }

    private static string GetClassification(int score)
    {
        return score switch
        {
            >= 85 => "PRIORIDADE MÁXIMA",
            >= 70 => "PRIORIDADE ALTA",
            >= 50 => "PRIORIDADE MODERADA",
            >= 30 => "PRIORIDADE BAIXA",
            >= 15 => "CONSIDERÁVEL",
            _ => "NÃO RECOMENDADO"
        };
    }

    private static decimal CalculateDistance(decimal lat, decimal lng)
    {
        var R = 6371m;
        var dLat = (decimal)((double)(lat - DSIN_LAT) * Math.PI / 180);
        var dLng = (decimal)((double)(lng - DSIN_LNG) * Math.PI / 180);
        var a = (decimal)(Math.Sin((double)dLat / 2) * Math.Sin((double)dLat / 2)) +
                (decimal)(Math.Cos((double)DSIN_LAT * Math.PI / 180) * Math.Cos((double)lat * Math.PI / 180) *
                Math.Sin((double)dLng / 2) * Math.Sin((double)dLng / 2));
        return (decimal)((double)R * 2 * Math.Atan2(Math.Sqrt((double)a), Math.Sqrt(1 - (double)a)));
    }

    private static List<string> GenerateRiskFactors(PrimordialDuck duck)
    {
        var factors = new List<string>();

        if (duck.HibernationStatus == HibernationStatusEnum.Awake)
            factors.Add("Pato Primordial desperto - extremamente perigoso");
        else if (duck.HibernationStatus == HibernationStatusEnum.InTrance && duck.HeartRate > 60)
            factors.Add($"Em transe com batimentos elevados ({duck.HeartRate} bpm) - risco de despertar");

        if (duck.SuperPower != null)
        {
            var powerRisk = duck.SuperPower.Classification switch
            {
                SuperPowerClassificationEnum.Warlike => "Super poder bélico - alta capacidade de combate",
                SuperPowerClassificationEnum.Temporal => "Manipulação temporal - imprevisível",
                SuperPowerClassificationEnum.Dimensional => "Poderes dimensionais - pode escapar facilmente",
                SuperPowerClassificationEnum.Psychic => "Habilidades psíquicas - pode detectar aproximação",
                SuperPowerClassificationEnum.Elemental => "Controle elemental - forças destrutivas",
                SuperPowerClassificationEnum.Technological => "Interface tecnológica - armas avançadas",
                SuperPowerClassificationEnum.Biological => "Mutações biológicas - comportamento imprevisível",
                _ => null
            };
            if (powerRisk != null)
                factors.Add(powerRisk);
        }

        var distance = CalculateDistance(duck.Location.Latitude, duck.Location.Longitude);
        if (distance > 3000)
            factors.Add($"Distância extrema da base ({distance:F0}km) - logística muito complexa");
        else if (distance > 1500)
            factors.Add($"Grande distância da base ({distance:F0}km) - operação prolongada");
        else if (distance > 500)
            factors.Add($"Distância moderada da base ({distance:F0}km) - planejamento necessário");

        if (duck.MutationCount >= 10)
            factors.Add("Número extremo de mutações - comportamento caótico");
        else if (duck.MutationCount >= 8)
            factors.Add("Altíssimo número de mutações - comportamento extremamente imprevisível");
        else if (duck.MutationCount >= 6)
            factors.Add("Alto número de mutações - comportamento imprevisível");
        else if (duck.MutationCount >= 4)
            factors.Add("Mutações moderadas - cuidado necessário");

        var heightCm = duck.Height.ToCentimeters();
        if (heightCm > 3500)
            factors.Add("Tamanho colossal - contenção extremamente complexa");
        else if (heightCm > 2000)
            factors.Add("Tamanho gigantesco - dificuldade de contenção");
        else if (heightCm > 1000)
            factors.Add("Tamanho muito grande - equipamento especial necessário");
        else if (heightCm > 600)
            factors.Add("Tamanho grande - planejamento de contenção");

        var weightG = duck.Weight.ToGrams();
        if (weightG > 250000)
            factors.Add("Peso extremo - transporte especializado obrigatório");
        else if (weightG > 150000)
            factors.Add("Peso muito elevado - equipamento de transporte pesado");
        else if (weightG > 80000)
            factors.Add("Peso elevado - veículos reforçados necessários");

        var precisionCm = duck.GpsPrecision.ToCentimeters();
        if (precisionCm > 2000)
            factors.Add("Precisão GPS muito baixa - dificuldade extrema de localização");
        else if (precisionCm > 1000)
            factors.Add("Precisão GPS baixa - busca prolongada");
        else if (precisionCm > 500)
            factors.Add("Precisão GPS moderada - tempo extra de busca");

        return factors;
    }

    private static List<string> GenerateValueFactors(PrimordialDuck duck)
    {
        var factors = new List<string>();

        if (duck.MutationCount >= 10)
            factors.Add($"Potencial genético extremo ({duck.MutationCount} mutações) - descoberta científica histórica");
        else if (duck.MutationCount >= 8)
            factors.Add($"Altíssimo potencial genético ({duck.MutationCount} mutações) - avanço científico revolucionário");
        else if (duck.MutationCount >= 6)
            factors.Add($"Alto potencial genético ({duck.MutationCount} mutações) - grande valor científico");
        else if (duck.MutationCount >= 4)
            factors.Add($"Bom potencial genético ({duck.MutationCount} mutações) - valor científico considerável");
        else if (duck.MutationCount >= 2)
            factors.Add($"Potencial genético moderado ({duck.MutationCount} mutações) - interesse científico");

        if (duck.SuperPower != null)
        {
            var powerValue = duck.SuperPower.Classification switch
            {
                SuperPowerClassificationEnum.Temporal => "Poderes temporais - revolução na física e cosmologia",
                SuperPowerClassificationEnum.Dimensional => "Capacidades dimensionais - avanço na mecânica quântica",
                SuperPowerClassificationEnum.Psychic => "Habilidades psíquicas - breakthrough na neurociência",
                SuperPowerClassificationEnum.Technological => "Interface tecnológica - biomecânica e IA avançada",
                SuperPowerClassificationEnum.Biological => "Poderes biológicos - biotecnologia revolucionária",
                SuperPowerClassificationEnum.Elemental => "Controle elemental - nova física aplicada",
                SuperPowerClassificationEnum.Warlike => "Capacidades bélicas - estudo de bioarmas",
                SuperPowerClassificationEnum.Defensive => "Habilidades defensivas - biomateriais avançados",
                _ => "Super poder único para pesquisa"
            };
            factors.Add(powerValue);
        }

        if (duck.HibernationStatus == HibernationStatusEnum.DeepHibernation)
            factors.Add("Estado de hibernação profunda - metabolismo único e preservação celular");
        else if (duck.HibernationStatus == HibernationStatusEnum.InTrance && duck.HeartRate <= 30)
            factors.Add("Transe profundo - estudo de estados alterados de consciência");

        var distance = CalculateDistance(duck.Location.Latitude, duck.Location.Longitude);
        if (distance < 100)
            factors.Add("Proximidade extrema da base - estudos contínuos e monitoramento");
        else if (distance < 500)
            factors.Add("Proximidade da base - facilita estudos prolongados");

        var heightCm = duck.Height.ToCentimeters();
        var weightG = duck.Weight.ToGrams();

        if (heightCm > 4000 || heightCm < 100)
            factors.Add("Dimensões extremas - fenômeno biológico único");
        else if (heightCm > 2500 || heightCm < 120)
            factors.Add("Dimensões muito raras - valor morfológico excepcional");
        else if (heightCm > 1500 || heightCm < 150)
            factors.Add("Dimensões raras - interesse morfológico");

        if (weightG > 300000 || weightG < 8000)
            factors.Add("Massa corporal extrema - estudo de densidade e composição revolucionário");
        else if (weightG > 200000 || weightG < 12000)
            factors.Add("Massa corporal rara - estudo de densidade e composição");

        var precisionCm = duck.GpsPrecision.ToCentimeters();
        if (precisionCm <= 10)
            factors.Add("Localização ultra-precisa - dados extremamente confiáveis");
        else if (precisionCm <= 25)
            factors.Add("Localização muito precisa - dados muito confiáveis");
        else if (precisionCm <= 50)
            factors.Add("Boa precisão de localização - facilita coleta de dados");
        else if (precisionCm <= 150)
            factors.Add("Precisão razoável - dados úteis para pesquisa");


        if (duck.MutationCount >= 10 && duck.SuperPower != null)
            factors.Add("Combinação única: mutações extremas + super poder - espécime histórico");
        else if (duck.MutationCount >= 8 && duck.SuperPower != null)
            factors.Add("Combinação muito rara: alta mutação + super poder - espécime excepcional");
        else if (duck.MutationCount >= 6 && duck.SuperPower != null)
            factors.Add("Combinação rara: mutação + super poder - espécime único");

        if (duck.HibernationStatus == HibernationStatusEnum.DeepHibernation && duck.MutationCount >= 8)
            factors.Add("Hibernação profunda com mutações extremas - metabolismo revolucionário");
        else if (duck.HibernationStatus == HibernationStatusEnum.DeepHibernation && duck.MutationCount >= 5)
            factors.Add("Hibernação profunda com mutações - metabolismo evolutivo");

        if (duck.SuperPower?.Classification == SuperPowerClassificationEnum.Temporal && duck.MutationCount >= 5)
            factors.Add("Poderes temporais altamente mutados - chave para viagem no tempo");
        else if (duck.SuperPower?.Classification == SuperPowerClassificationEnum.Temporal && duck.MutationCount >= 3)
            factors.Add("Poderes temporais mutados - possível avanço temporal");

        return factors;
    }
}