using PrimordialDuckOperation.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace PrimordialDuckOperation.Application.DTOs;

public record CreateDroneRequestDto
{
    [Required(ErrorMessage = "Número de série é obrigatório")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Número de série deve ter entre 3 e 50 caracteres")]
    public string SerialNumber { get; init; } = string.Empty;

    [Required(ErrorMessage = "Marca é obrigatória")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Marca deve ter entre 2 e 50 caracteres")]
    public string Brand { get; init; } = string.Empty;

    [Required(ErrorMessage = "Fabricante é obrigatório")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Fabricante deve ter entre 2 e 100 caracteres")]
    public string Manufacturer { get; init; } = string.Empty;

    [Required(ErrorMessage = "País de origem é obrigatório")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "País de origem deve ter entre 2 e 50 caracteres")]
    public string CountryOfOrigin { get; init; } = string.Empty;

    [Required(ErrorMessage = "Tipo do drone é obrigatório")]
    public DroneTypeEnum Type { get; init; }
}