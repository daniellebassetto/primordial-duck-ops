using PrimordialDuckOperation.Application.DTOs;

namespace PrimordialDuckOperation.Application.Interfaces;

public interface ICaptureOperationService : IBaseService<CaptureOperationResponseDto, CreateCaptureOperationDto, UpdateCaptureOperationDto, InputFilterCaptureOperation>
{
    Task<CaptureStrategyResponseDto?> GenerateStrategyAsync(CreateCaptureOperationDto createCaptureOperationDto);
    Task<bool> StartOperationAsync(long operationId);
    Task<bool> CompleteOperationAsync(long operationId, CompleteOperationDto completeOperationDto);
}