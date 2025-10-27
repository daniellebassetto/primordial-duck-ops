namespace PrimordialDuckOperation.Application.DTOs;

public class PasswordResetResponseDto
{
    public string TemporaryPassword { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
