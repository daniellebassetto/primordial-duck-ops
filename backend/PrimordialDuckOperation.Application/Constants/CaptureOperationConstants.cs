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
