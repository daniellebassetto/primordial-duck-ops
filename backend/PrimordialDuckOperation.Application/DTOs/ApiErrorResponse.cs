namespace PrimordialDuckOperation.Application.DTOs;

public class ApiErrorResponse
{
    public bool Success => false;
    public string? Message { get; set; }
    public List<string>? Errors { get; set; }
}