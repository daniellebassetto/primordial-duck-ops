using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.Services;

namespace PrimordialDuckOperation.Api.Controllers;

[Route("api/[controller]")]
public class AuthController(AuthService authService) : Controller
{
    private readonly AuthService _authService = authService;

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<ApiSuccessResponse<AuthResponseDto>>> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(new ApiErrorResponse { Message = "Dados inválidos", Errors = errors });
        }

        var result = await _authService.LoginAsync(request);
        if (result == null)
            return Unauthorized(new ApiErrorResponse { Message = "Credenciais inválidas" });

        return Ok(new ApiSuccessResponse<AuthResponseDto> { Data = result });
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<ApiSuccessResponse<AuthResponseDto>>> Register([FromBody] RegisterRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(new ApiErrorResponse { Message = "Dados inválidos", Errors = errors });
        }

        var (response, error) = await _authService.RegisterAsync(request);
        if (response == null)
            return BadRequest(new ApiErrorResponse { Message = error ?? "Erro no alistamento" });

        return CreatedAtAction(nameof(Login), null, new ApiSuccessResponse<AuthResponseDto> { Data = response });
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiSuccessResponse<PasswordResetResponseDto>>> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(new ApiErrorResponse { Message = "Dados inválidos", Errors = errors });
        }

        var (response, error) = await _authService.RequestPasswordResetAsync(request);
        if (response == null)
            return Ok(new ApiSuccessResponse<string> { Data = error ?? "Instruções enviadas" });

        return Ok(new ApiSuccessResponse<PasswordResetResponseDto> { Data = response });
    }

    [HttpPost("change-password")]
    public async Task<ActionResult<ApiSuccessResponse<string>>> ChangePassword([FromBody] ChangePasswordRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(new ApiErrorResponse { Message = "Dados inválidos", Errors = errors });
        }

        var userId = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new ApiErrorResponse { Message = "Usuário não autenticado" });

        var (success, error) = await _authService.ChangePasswordAsync(userId, request);
        if (!success)
            return BadRequest(new ApiErrorResponse { Message = error ?? "Erro ao alterar senha" });

        return Ok(new ApiSuccessResponse<string> { Data = "Senha alterada com sucesso" });
    }
}