using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Domain.Interfaces;

public interface IDroneRepository : IBaseRepository<Drone>
{
    Task<IEnumerable<Drone>> GetByTypeAsync(DroneTypeEnum type);
}