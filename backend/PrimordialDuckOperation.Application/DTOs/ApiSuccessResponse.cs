namespace PrimordialDuckOperation.Application.DTOs;

public class ApiSuccessResponse<T>
{
    public bool Success => true;
    public T Data { get; set; } = default!;
}

public class ApiSuccessResponse
{
    public static bool Success => true;
}