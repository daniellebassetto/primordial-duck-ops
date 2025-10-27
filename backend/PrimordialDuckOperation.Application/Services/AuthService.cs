using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PrimordialDuckOperation.Application.Services;

public class AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly SignInManager<ApplicationUser> _signInManager = signInManager;

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return null;

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
            return null;

        var token = GenerateJwtToken(user);
        return new AuthResponseDto { Token = token };
    }

    public async Task<(AuthResponseDto? Response, string? Error)> RegisterAsync(RegisterRequestDto request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            Name = request.Name,
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return (null, string.Join(", ", result.Errors.Select(e => e.Description)));

        var token = GenerateJwtToken(user);
        return (new AuthResponseDto { Token = token }, null);
    }

    public async Task<(PasswordResetResponseDto? Response, string? Error)> RequestPasswordResetAsync(ForgotPasswordRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return (null, null);

        var tempPassword = GenerateTemporaryPassword();

        var removePasswordResult = await _userManager.RemovePasswordAsync(user);
        if (!removePasswordResult.Succeeded)
            return (null, "Erro ao processar redefinição de senha");

        var addPasswordResult = await _userManager.AddPasswordAsync(user, tempPassword);
        if (!addPasswordResult.Succeeded)
            return (null, "Erro ao processar redefinição de senha");

        return (new PasswordResetResponseDto { TemporaryPassword = tempPassword, Email = user.Email! }, null);
    }

    public async Task<(bool Success, string? Error)> ChangePasswordAsync(string userId, ChangePasswordRequestDto request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return (false, "Usuário não encontrado");

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

        return (true, null);
    }

    private static string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        return new string([.. Enumerable.Repeat(chars, 10).Select(s => s[random.Next(s.Length)])]);
    }

    private static string GenerateJwtToken(ApplicationUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("PrimordialDuckOperationSecretKey123456789"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("id", user.Id.ToString()),
            new Claim("name", user.Name),
            new Claim("email", user.Email!),
            new Claim("role", user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: "PrimordialDuckOperation",
            audience: "PrimordialDuckOperation",
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}