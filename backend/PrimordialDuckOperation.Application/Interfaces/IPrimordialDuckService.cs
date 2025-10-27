using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.PrimordialDuck;

namespace PrimordialDuckOperation.Application.Interfaces;

public interface IPrimordialDuckService : IBaseService<PrimordialDuckResponseDto, CreatePrimordialDuckRequestDto, UpdatePrimordialDuckRequestDto, InputFilterPrimordialDuck>
{
    Task<CaptureAnalysisResponseDto?> GetCaptureAnalysisAsync(long id);
    Task<IEnumerable<PrimordialDuckResponseDto>> GetAvailableForCaptureAsync();
}