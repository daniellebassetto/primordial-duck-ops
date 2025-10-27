namespace PrimordialDuckOperation.Application.Constants;

public static class CaptureOperationConstants
{
    public static class ErrorMessages
    {
        public const string DuckAlreadyHasOperation = "Este Pato Primordial j� possui uma opera��o de captura.";
        public const string DuckOrDroneNotFound = "Pato ou drone n�o encontrado";
    }

    public static class SortFields
    {
        public const string StartTime = "starttime";
        public const string Status = "status";
        public const string SuccessChance = "successchance";
    }

    public static class StrategyDescriptions
    {
        public const string StealthApproach = "Aproxima��o Furtiva - Infiltra��o silenciosa usando camuflagem avan�ada";
        public const string DirectAssault = "Assalto Direto - Ataque frontal com for�a m�xima";
        public const string TrapDeployment = "Armadilha Estrat�gica - Posicionamento de dispositivos de captura";
        public const string DistractionTactic = "T�tica de Distra��o - Desvio de aten��o seguido de captura";
        public const string AerialBombardment = "Bombardeio A�reo - Ataque coordenado do alto";
        public const string UnderwaterAmbush = "Emboscada Aqu�tica - Ataque surpresa submerso";
        public const string Unknown = "Estrat�gia Desconhecida";
    }

    public static class DefenseDescriptions
    {
        public const string EnergyShield = "Escudo de Energia - Barreira energ�tica deflectora";
        public const string CamouflageField = "Campo de Camuflagem - Invisibilidade tempor�ria";
        public const string TeleportationBurst = "Rajada de Teletransporte - Deslocamento instant�neo";
        public const string PsychicBarrier = "Barreira Ps�quica - Prote��o mental contra ataques";
        public const string ElementalWard = "Prote��o Elemental - Resist�ncia a elementos naturais";
        public const string TimeDistortion = "Distor��o Temporal - Manipula��o do fluxo do tempo";
        public const string Unknown = "Defesa Desconhecida";
    }

    public static class ResultDescriptions
    {
        public const string Success = "Captura realizada com sucesso";
        public const string Failed = "Falha na opera��o de captura";
        public const string Escaped = "Pato conseguiu escapar durante a opera��o";
        public const string DroneDestroyed = "Drone foi destru�do durante a opera��o";
        public const string Unknown = "Resultado desconhecido";
    }
}
