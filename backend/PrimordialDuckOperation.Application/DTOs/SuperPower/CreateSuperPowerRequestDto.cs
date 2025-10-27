using System.ComponentModel.DataAnnotations;

namespace PrimordialDuckOperation.Application.DTOs;

public record CreateSuperPowerRequestDto
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 100 caracteres")]
    public string Name { get; init; } = string.Empty;

    [Required(ErrorMessage = "Descrição é obrigatória")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "Descrição deve ter entre 10 e 500 caracteres")]
    public string Description { get; init; } = string.Empty;

    [Required(ErrorMessage = "Classificação é obrigatória")]
    [Range(1, 8, ErrorMessage = "Classificação deve estar entre 1 (Bélico) e 8 (Dimensional)")]
    public int Classification { get; init; }
}