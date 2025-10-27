using System.ComponentModel.DataAnnotations;

namespace PrimordialDuckOperation.Application.DTOs;

public class ChangePasswordRequestDto
{
    [Required(ErrorMessage = "Senha atual é obrigatória")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nova senha é obrigatória")]
    [MinLength(6, ErrorMessage = "Nova senha deve ter pelo menos 6 caracteres")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
    [Compare("NewPassword", ErrorMessage = "As senhas não coincidem")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
