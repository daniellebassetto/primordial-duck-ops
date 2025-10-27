using System.ComponentModel.DataAnnotations;

namespace PrimordialDuckOperation.Application.DTOs;

public class ForgotPasswordRequestDto
{
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
    public string Email { get; set; } = string.Empty;
}
