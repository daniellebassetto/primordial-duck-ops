namespace PrimordialDuckOperation.Application.Constants;

public static class CaptureOperationConstants
{
    public static class ErrorMessages
    {
        public const string DuckAlreadyHasOperation = "Este Pato Primordial já possui uma operação de captura.";
        public const string DuckOrDroneNotFound = "Pato ou drone não encontrado";
    }

    public static class SortFields
    {
        public const string StartTime = "starttime";
        public const string Status = "status";
        public const string SuccessChance = "successchance";
    }

    public static class StrategyDescriptions
    {
        public const string StealthApproach = "Aproximação Furtiva - Infiltração silenciosa usando camuflagem avançada";
        public const string DirectAssault = "Assalto Direto - Ataque frontal com força máxima";
        public const string TrapDeployment = "Armadilha Estratégica - Posicionamento de dispositivos de captura";
        public const string DistractionTactic = "Tática de Distração - Desvio de atenção seguido de captura";
        public const string AerialBombardment = "Bombardeio Aéreo - Ataque coordenado do alto";
        public const string UnderwaterAmbush = "Emboscada Aquática - Ataque surpresa submerso";
        public const string TacticalSiege = "Cerco Tático - Bloqueio estratégico de todas as rotas de fuga";
        public const string SilentInfiltration = "Infiltração Silenciosa - Aproximação indetectável com supressão de sinais";
        public const string LightningStrike = "Ataque Relâmpago - Investida ultrarrápida antes de reação";
        public const string FlankingManeuver = "Manobra Envolvente - Ataque coordenado por múltiplos ângulos";
        public const string AreaSuppression = "Supressão de Área - Neutralização de zona com pulsos atordoantes";
        public const string HolographicDecoy = "Isca Holográfica - Projeções para confundir e capturar";
        public const string SonicPulse = "Pulso Sônico - Ondas de choque para desorientar o alvo";
        public const string ContainmentNet = "Rede de Contenção - Malha energética expansiva inescapável";
        public const string GravityInversion = "Inversão Gravitacional - Manipulação de campo para imobilizar";
        public const string Unknown = "Estratégia Desconhecida";
    }

    public static class DefenseDescriptions
    {
        public const string EnergyShield = "Escudo de Energia - Barreira energética deflectora";
        public const string CamouflageField = "Campo de Camuflagem - Invisibilidade temporária";
        public const string TeleportationBurst = "Rajada de Teletransporte - Deslocamento instantâneo";
        public const string PsychicBarrier = "Barreira Psíquica - Proteção mental contra ataques";
        public const string ElementalWard = "Proteção Elemental - Resistência a elementos naturais";
        public const string TimeDistortion = "Distorção Temporal - Manipulação do fluxo do tempo";
        public const string BiologicalArmor = "Armadura Biológica - Camada regenerativa de tecido blindado";
        public const string QuantumReflection = "Reflexão Quântica - Espelhamento de ataques para o emissor";
        public const string KineticAbsorption = "Absorção Cinética - Conversão de impactos em energia";
        public const string MagneticField = "Campo Magnético - Repulsão de projéteis e drones metálicos";
        public const string NeuralInterference = "Interferência Neural - Bloqueio de comandos remotos";
        public const string PlasmaDome = "Cúpula de Plasma - Barreira super aquecida incineradora";
        public const string DefensiveCloning = "Clonagem Defensiva - Criação de cópias para confundir";
        public const string DimensionalPrison = "Prisão Dimensional - Aprisionamento em bolsão espacial";
        public const string AcceleratedRegeneration = "Regeneração Acelerada - Cura instantânea de ferimentos";
        public const string Unknown = "Defesa Desconhecida";
    }

    public static class ResultDescriptions
    {
        public const string Success = "Captura realizada com sucesso";
        public const string Failed = "Falha na operação de captura";
        public const string Escaped = "Pato conseguiu escapar durante a operação";
        public const string DroneDestroyed = "Drone foi destruído durante a operação";
        public const string Unknown = "Resultado desconhecido";
    }
}
