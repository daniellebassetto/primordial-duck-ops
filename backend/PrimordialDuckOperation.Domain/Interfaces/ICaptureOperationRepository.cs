using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Domain.Interfaces;

public interface ICaptureOperationRepository : IBaseRepository<CaptureOperation>
{
    Task<IEnumerable<CaptureOperation>> GetByStatusAsync(CaptureStatus status);
    Task<bool> HasOperationsByDuckIdAsync(long duckId);
}