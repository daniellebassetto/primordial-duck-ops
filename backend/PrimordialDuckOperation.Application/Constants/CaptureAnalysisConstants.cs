namespace PrimordialDuckOperation.Application.Constants;

public static class CaptureAnalysisConstants
{
    public static class BaseLocation
    {
        public const decimal DsinLatitude = -22.23346927395992m;
        public const decimal DsinLongitude = -49.934162215340926m;
        public const decimal EarthRadiusKm = 6371m;
    }

    public static class BaseValues
    {
        public const int OperationalCostBase = 15;
        public const int MilitaryPowerBase = 10;
        public const int RiskLevelBase = 5;
        public const int ScientificValueBase = 20;
    }

    public static class ScoreWeights
    {
        public const decimal CostPenaltyHighMultiplier = 0.5m;
        public const decimal CostPenaltyNormalMultiplier = 0.3m;
        public const decimal RiskPenaltyHighMultiplier = 0.8m;
        public const decimal RiskPenaltyNormalMultiplier = 0.5m;
        public const decimal MilitaryPenaltyMultiplier = 0.4m;
        public const decimal ScientificValueMultiplier = 1.8m;
        public const decimal CostPenaltyDivisor = 2m;
        public const int HighCostThreshold = 80;
        public const int HighRiskThreshold = 70;
    }

    public static class HibernationBonuses
    {
        public const decimal DeepHibernationBonus = 40m;
        public const decimal InTranceBonus = 25m;
        public const decimal AwakePenalty = -30m;
    }

    public static class HibernationMultipliers
    {
        public const decimal AwakeMultiplier = 3.0m;
        public const decimal DeepHibernationMultiplier = 0.3m;
    }

    public static class TranceMultipliers
    {
        public const decimal VeryHigh = 2.2m;
        public const decimal High = 1.8m;
        public const decimal Medium = 1.4m;
        public const decimal Low = 1.0m;
        public const decimal VeryLow = 0.6m;
    }

    public static class SuperPowerMultipliers
    {
        public const decimal AwakeMultiplier = 1.5m;
        public const decimal InTranceMultiplier = 0.7m;
        public const decimal DeepHibernationMultiplier = 0.2m;
        public const decimal PowerRiskDeepMultiplier = 0.3m;
        public const decimal PowerRiskTranceMultiplier = 0.6m;
    }

    public static class MutationMultipliers
    {
        public const int ExtremeMultiplier = 3;
        public const int HighMultiplier = 2;
        public const int NormalMultiplier = 1;
        public const int PowerExtremeMultiplier = 5;
        public const int PowerHighMultiplier = 4;
        public const int PowerMediumMultiplier = 3;
        public const int PowerLowMultiplier = 2;
    }

    public static class Classifications
    {
        public const string MaxPriority = "PRIORIDADE MÁXIMA";
        public const string HighPriority = "PRIORIDADE ALTA";
        public const string ModeratePriority = "PRIORIDADE MODERADA";
        public const string LowPriority = "PRIORIDADE BAIXA";
        public const string Considerable = "CONSIDERÁVEL";
        public const string NotRecommended = "NÃO RECOMENDADO";
    }

    public static class RiskFactorMessages
    {
        public const string AwakeDuck = "Pato Primordial desperto - extremamente perigoso";
        public const string TranceHighHeartRate = "Em transe com batimentos elevados ({0} bpm) - risco de despertar";
        public const string WarlikePower = "Super poder bélico - alta capacidade de combate";
        public const string TemporalPower = "Manipulação temporal - imprevisível";
        public const string DimensionalPower = "Poderes dimensionais - pode escapar facilmente";
        public const string PsychicPower = "Habilidades psíquicas - pode detectar aproximação";
        public const string ElementalPower = "Controle elemental - forças destrutivas";
        public const string TechnologicalPower = "Interface tecnológica - armas avançadas";
        public const string BiologicalPower = "Mutações biológicas - comportamento imprevisível";
        public const string ExtremeDistance = "Distância extrema da base ({0:F0}km) - logística muito complexa";
        public const string LargeDistance = "Grande distância da base ({0:F0}km) - operação prolongada";
        public const string ModerateDistance = "Distância moderada da base ({0:F0}km) - planejamento necessário";
        public const string ExtremeMutations = "Número extremo de mutações - comportamento caótico";
        public const string VeryHighMutations = "Altíssimo número de mutações - comportamento extremamente imprevisível";
        public const string HighMutations = "Alto número de mutações - comportamento imprevisível";
        public const string ModerateMutations = "Mutações moderadas - cuidado necessário";
        public const string ColossalSize = "Tamanho colossal - contenção extremamente complexa";
        public const string GiganticSize = "Tamanho gigantesco - dificuldade de contenção";
        public const string VeryLargeSize = "Tamanho muito grande - equipamento especial necessário";
        public const string LargeSize = "Tamanho grande - planejamento de contenção";
        public const string ExtremeWeight = "Peso extremo - transporte especializado obrigatório";
        public const string VeryHighWeight = "Peso muito elevado - equipamento de transporte pesado";
        public const string HighWeight = "Peso elevado - veículos reforçados necessários";
        public const string VeryLowGpsPrecision = "Precisão GPS muito baixa - dificuldade extrema de localização";
        public const string LowGpsPrecision = "Precisão GPS baixa - busca prolongada";
        public const string ModerateGpsPrecision = "Precisão GPS moderada - tempo extra de busca";
    }

    public static class ValueFactorMessages
    {
        public const string ExtremeGeneticPotential = "Potencial genético extremo ({0} mutações) - descoberta científica histórica";
        public const string VeryHighGeneticPotential = "Altíssimo potencial genético ({0} mutações) - avanço científico revolucionário";
        public const string HighGeneticPotential = "Alto potencial genético ({0} mutações) - grande valor científico";
        public const string GoodGeneticPotential = "Bom potencial genético ({0} mutações) - valor científico considerável";
        public const string ModerateGeneticPotential = "Potencial genético moderado ({0} mutações) - interesse científico";
        public const string TemporalPowers = "Poderes temporais - revolução na física e cosmologia";
        public const string DimensionalPowers = "Capacidades dimensionais - avanço na mecânica quântica";
        public const string PsychicPowers = "Habilidades psíquicas - breakthrough na neurociência";
        public const string TechnologicalPowers = "Interface tecnológica - biomecânica e IA avançada";
        public const string BiologicalPowers = "Poderes biológicos - biotecnologia revolucionária";
        public const string ElementalPowers = "Controle elemental - nova física aplicada";
        public const string WarlikePowers = "Capacidades bélicas - estudo de bioarmas";
        public const string DefensivePowers = "Habilidades defensivas - biomateriais avançados";
        public const string UniquePower = "Super poder único para pesquisa";
        public const string DeepHibernation = "Estado de hibernação profunda - metabolismo único e preservação celular";
        public const string DeepTrance = "Transe profundo - estudo de estados alterados de consciência";
        public const string VeryCloseToBase = "Proximidade extrema da base - estudos contínuos e monitoramento";
        public const string CloseToBase = "Proximidade da base - facilita estudos prolongados";
        public const string ExtremeDimensions = "Dimensões extremas - fenômeno biológico único";
        public const string VeryRareDimensions = "Dimensões muito raras - valor morfológico excepcional";
        public const string RareDimensions = "Dimensões raras - interesse morfológico";
        public const string ExtremeMass = "Massa corporal extrema - estudo de densidade e composição revolucionário";
        public const string RareMass = "Massa corporal rara - estudo de densidade e composição";
        public const string UltraPreciseLocation = "Localização ultra-precisa - dados extremamente confiáveis";
        public const string VeryPreciseLocation = "Localização muito precisa - dados muito confiáveis";
        public const string GoodPrecisionLocation = "Boa precisão de localização - facilita coleta de dados";
        public const string ReasonablePrecision = "Precisão razoável - dados úteis para pesquisa";
        public const string UniqueComboExtreme = "Combinação única: mutações extremas + super poder - espécime histórico";
        public const string VeryRareCombo = "Combinação muito rara: alta mutação + super poder - espécime excepcional";
        public const string RareCombo = "Combinação rara: mutação + super poder - espécime único";
        public const string HibernationExtremeCombo = "Hibernação profunda com mutações extremas - metabolismo revolucionário";
        public const string HibernationCombo = "Hibernação profunda com mutações - metabolismo evolutivo";
        public const string TemporalHighMutation = "Poderes temporais altamente mutados - chave para viagem no tempo";
        public const string TemporalMutation = "Poderes temporais mutados - possível avanço temporal";
    }
}
