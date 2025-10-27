using PrimordialDuckOperation.Domain.Entities;

namespace PrimordialDuckOperation.Domain.Interfaces;

public interface IPrimordialDuckRepository : IBaseRepository<PrimordialDuck>
{
    Task<IEnumerable<PrimordialDuck>> GetAvailableForCaptureAsync();
}