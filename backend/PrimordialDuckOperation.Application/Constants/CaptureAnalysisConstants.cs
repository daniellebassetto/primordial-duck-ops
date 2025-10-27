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
        public const string MaxPriority = "PRIORIDADE M�XIMA";
        public const string HighPriority = "PRIORIDADE ALTA";
        public const string ModeratePriority = "PRIORIDADE MODERADA";
        public const string LowPriority = "PRIORIDADE BAIXA";
        public const string Considerable = "CONSIDER�VEL";
        public const string NotRecommended = "N�O RECOMENDADO";
    }

    public static class RiskFactorMessages
    {
        public const string AwakeDuck = "Pato Primordial desperto - extremamente perigoso";
        public const string TranceHighHeartRate = "Em transe com batimentos elevados ({0} bpm) - risco de despertar";
        public const string WarlikePower = "Super poder b�lico - alta capacidade de combate";
        public const string TemporalPower = "Manipula��o temporal - imprevis�vel";
        public const string DimensionalPower = "Poderes dimensionais - pode escapar facilmente";
        public const string PsychicPower = "Habilidades ps�quicas - pode detectar aproxima��o";
        public const string ElementalPower = "Controle elemental - for�as destrutivas";
        public const string TechnologicalPower = "Interface tecnol�gica - armas avan�adas";
        public const string BiologicalPower = "Muta��es biol�gicas - comportamento imprevis�vel";
        public const string ExtremeDistance = "Dist�ncia extrema da base ({0:F0}km) - log�stica muito complexa";
        public const string LargeDistance = "Grande dist�ncia da base ({0:F0}km) - opera��o prolongada";
        public const string ModerateDistance = "Dist�ncia moderada da base ({0:F0}km) - planejamento necess�rio";
        public const string ExtremeMutations = "N�mero extremo de muta��es - comportamento ca�tico";
        public const string VeryHighMutations = "Alt�ssimo n�mero de muta��es - comportamento extremamente imprevis�vel";
        public const string HighMutations = "Alto n�mero de muta��es - comportamento imprevis�vel";
        public const string ModerateMutations = "Muta��es moderadas - cuidado necess�rio";
        public const string ColossalSize = "Tamanho colossal - conten��o extremamente complexa";
        public const string GiganticSize = "Tamanho gigantesco - dificuldade de conten��o";
        public const string VeryLargeSize = "Tamanho muito grande - equipamento especial necess�rio";
        public const string LargeSize = "Tamanho grande - planejamento de conten��o";
        public const string ExtremeWeight = "Peso extremo - transporte especializado obrigat�rio";
        public const string VeryHighWeight = "Peso muito elevado - equipamento de transporte pesado";
        public const string HighWeight = "Peso elevado - ve�culos refor�ados necess�rios";
        public const string VeryLowGpsPrecision = "Precis�o GPS muito baixa - dificuldade extrema de localiza��o";
        public const string LowGpsPrecision = "Precis�o GPS baixa - busca prolongada";
        public const string ModerateGpsPrecision = "Precis�o GPS moderada - tempo extra de busca";
    }

    public static class ValueFactorMessages
    {
        public const string ExtremeGeneticPotential = "Potencial gen�tico extremo ({0} muta��es) - descoberta cient�fica hist�rica";
        public const string VeryHighGeneticPotential = "Alt�ssimo potencial gen�tico ({0} muta��es) - avan�o cient�fico revolucion�rio";
        public const string HighGeneticPotential = "Alto potencial gen�tico ({0} muta��es) - grande valor cient�fico";
        public const string GoodGeneticPotential = "Bom potencial gen�tico ({0} muta��es) - valor cient�fico consider�vel";
        public const string ModerateGeneticPotential = "Potencial gen�tico moderado ({0} muta��es) - interesse cient�fico";
        public const string TemporalPowers = "Poderes temporais - revolu��o na f�sica e cosmologia";
        public const string DimensionalPowers = "Capacidades dimensionais - avan�o na mec�nica qu�ntica";
        public const string PsychicPowers = "Habilidades ps�quicas - breakthrough na neuroci�ncia";
        public const string TechnologicalPowers = "Interface tecnol�gica - biomec�nica e IA avan�ada";
        public const string BiologicalPowers = "Poderes biol�gicos - biotecnologia revolucion�ria";
        public const string ElementalPowers = "Controle elemental - nova f�sica aplicada";
        public const string WarlikePowers = "Capacidades b�licas - estudo de bioarmas";
        public const string DefensivePowers = "Habilidades defensivas - biomateriais avan�ados";
        public const string UniquePower = "Super poder �nico para pesquisa";
        public const string DeepHibernation = "Estado de hiberna��o profunda - metabolismo �nico e preserva��o celular";
        public const string DeepTrance = "Transe profundo - estudo de estados alterados de consci�ncia";
        public const string VeryCloseToBase = "Proximidade extrema da base - estudos cont�nuos e monitoramento";
        public const string CloseToBase = "Proximidade da base - facilita estudos prolongados";
        public const string ExtremeDimensions = "Dimens�es extremas - fen�meno biol�gico �nico";
        public const string VeryRareDimensions = "Dimens�es muito raras - valor morfol�gico excepcional";
        public const string RareDimensions = "Dimens�es raras - interesse morfol�gico";
        public const string ExtremeMass = "Massa corporal extrema - estudo de densidade e composi��o revolucion�rio";
        public const string RareMass = "Massa corporal rara - estudo de densidade e composi��o";
        public const string UltraPreciseLocation = "Localiza��o ultra-precisa - dados extremamente confi�veis";
        public const string VeryPreciseLocation = "Localiza��o muito precisa - dados muito confi�veis";
        public const string GoodPrecisionLocation = "Boa precis�o de localiza��o - facilita coleta de dados";
        public const string ReasonablePrecision = "Precis�o razo�vel - dados �teis para pesquisa";
        public const string UniqueComboExtreme = "Combina��o �nica: muta��es extremas + super poder - esp�cime hist�rico";
        public const string VeryRareCombo = "Combina��o muito rara: alta muta��o + super poder - esp�cime excepcional";
        public const string RareCombo = "Combina��o rara: muta��o + super poder - esp�cime �nico";
        public const string HibernationExtremeCombo = "Hiberna��o profunda com muta��es extremas - metabolismo revolucion�rio";
        public const string HibernationCombo = "Hiberna��o profunda com muta��es - metabolismo evolutivo";
        public const string TemporalHighMutation = "Poderes temporais altamente mutados - chave para viagem no tempo";
        public const string TemporalMutation = "Poderes temporais mutados - poss�vel avan�o temporal";
    }
}
