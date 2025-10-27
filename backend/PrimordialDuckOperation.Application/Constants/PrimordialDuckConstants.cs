namespace PrimordialDuckOperation.Application.Constants;

public static class PrimordialDuckConstants
{
    public static class ValidationRanges
    {
        public const decimal MinHeightCentimeters = 80m;
        public const decimal MaxHeightCentimeters = 5000m;
        public const decimal MinHeightFeet = 2.62m;
        public const decimal MaxHeightFeet = 164.04m;

        public const decimal MinWeightGrams = 5000m;
        public const decimal MaxWeightGrams = 350000m;
        public const decimal MinWeightPounds = 11.02m;
        public const decimal MaxWeightPounds = 771.62m;

        public const decimal MinGpsPrecisionCentimeters = 4m;
        public const decimal MaxGpsPrecisionCentimeters = 3000m;
        public const decimal MinGpsPrecisionMeters = 0.04m;
        public const decimal MaxGpsPrecisionMeters = 30m;
        public const decimal MinGpsPrecisionYards = 0.044m;
        public const decimal MaxGpsPrecisionYards = 32.8m;
    }

    public static class ErrorMessages
    {
        public const string HeightCentimetersOutOfRange = "Altura deve estar entre 80cm e 5000cm";
        public const string HeightFeetOutOfRange = "Altura deve estar entre 2.62 e 164.04 p�s";
        public const string WeightGramsOutOfRange = "Peso deve estar entre 5000g e 350000g";
        public const string WeightPoundsOutOfRange = "Peso deve estar entre 11.02 e 771.62 libras";
        public const string GpsPrecisionCentimetersOutOfRange = "Precis�o GPS deve estar entre 4cm e 3000cm";
        public const string GpsPrecisionMetersOutOfRange = "Precis�o GPS deve estar entre 0.04m e 30m";
        public const string GpsPrecisionYardsOutOfRange = "Precis�o GPS deve estar entre 0.044 jardas e 32.8 jardas";
        public const string OnlyIdentificationDronesAllowed = "Apenas drones de identifica��o podem ser usados no cadastro de patos primordiais";
        public const string CannotDeleteDuckWithOperations = "N�o � poss�vel excluir este Pato Primordial pois existe uma opera��o de captura associada a ele.";
        public const string DroneNotFound = "O drone informado n�o existe";
        public const string SuperPowerNotFound = "O super poder informado n�o existe";
        public const string AwakeDuckRequiresSuperPower = "Patos primordiais no estado Desperto devem ter um super poder informado";
    }

    public static class SortFields
    {
        public const string HibernationStatus = "hibernationstatus";
        public const string MutationCount = "mutationcount";
        public const string DiscoveredAt = "discoveredat";
    }
}
