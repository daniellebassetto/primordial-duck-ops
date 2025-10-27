using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Domain.ValueObjects;

public record HeightMeasurement
{
    public decimal Value { get; init; }
    public HeightUnitEnum Unit { get; init; }

    public decimal ToCentimeters() => Unit switch
    {
        HeightUnitEnum.Centimeters => Value,
        HeightUnitEnum.Feet => Value * 30.48m,
        _ => Value
    };
}

public record WeightMeasurement
{
    public decimal Value { get; init; }
    public WeightUnitEnum Unit { get; init; }

    public decimal ToGrams() => Unit switch
    {
        WeightUnitEnum.Grams => Value,
        WeightUnitEnum.Pounds => Value * 453.592m,
        _ => Value
    };
}

public record PrecisionMeasurement
{
    public decimal Value { get; init; }
    public PrecisionUnitEnum Unit { get; init; }

    public decimal ToCentimeters() => Unit switch
    {
        PrecisionUnitEnum.Centimeters => Value,
        PrecisionUnitEnum.Meters => Value * 100m,
        PrecisionUnitEnum.Yards => Value * 91.44m,
        _ => Value
    };
}