using PrimordialDuckOperation.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace PrimordialDuckOperation.Application.DTOs;

public record UpdatePrimordialDuckRequestDto
{
    [Required(ErrorMessage = "Drone é obrigatório")]
    public long DroneId { get; init; }

    [StringLength(50, ErrorMessage = "Apelido deve ter no máximo 50 caracteres")]
    public string? Nickname { get; init; }

    [Required(ErrorMessage = "Altura é obrigatória")]
    public decimal HeightValue { get; init; }

    public HeightUnitEnum HeightUnit { get; init; }

    [Required(ErrorMessage = "Peso é obrigatório")]
    public decimal WeightValue { get; init; }

    public WeightUnitEnum WeightUnit { get; init; }

    [Required(ErrorMessage = "Nome da cidade é obrigatório")]
    [StringLength(100, ErrorMessage = "Nome da cidade deve ter no máximo 100 caracteres")]
    public string CityName { get; init; } = string.Empty;

    [Required(ErrorMessage = "País é obrigatório")]
    [StringLength(50, ErrorMessage = "País deve ter no máximo 50 caracteres")]
    public string Country { get; init; } = string.Empty;

    [Required(ErrorMessage = "Latitude é obrigatória")]
    [Range(-90, 90, ErrorMessage = "Latitude deve estar entre -90 e 90 graus")]
    public decimal Latitude { get; init; }

    [Required(ErrorMessage = "Longitude é obrigatória")]
    [Range(-180, 180, ErrorMessage = "Longitude deve estar entre -180 e 180 graus")]
    public decimal Longitude { get; init; }

    [StringLength(200, ErrorMessage = "Ponto de referência deve ter no máximo 200 caracteres")]
    public string? ReferencePoint { get; init; }

    [Required(ErrorMessage = "Precisão GPS é obrigatória")]
    public decimal GpsPrecisionValue { get; init; }

    public PrecisionUnitEnum GpsPrecisionUnit { get; init; }

    [Required(ErrorMessage = "Status de hibernação é obrigatório")]
    public HibernationStatusEnum HibernationStatus { get; init; }

    [Range(1, 300, ErrorMessage = "Batimentos cardíacos devem estar entre 1 e 300 bpm")]
    public int? HeartRate { get; init; }

    [Required(ErrorMessage = "Contagem de mutações é obrigatória")]
    [Range(0, 10, ErrorMessage = "Contagem de mutações deve estar entre 0 e 10")]
    public int MutationCount { get; init; }

    public long? SuperPowerId { get; init; }
}