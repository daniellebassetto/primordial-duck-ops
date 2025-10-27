using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;
using PrimordialDuckOperation.Domain.Interfaces;
using PrimordialDuckOperation.Infrastructure.Data;

namespace PrimordialDuckOperation.Infrastructure.Repositories;

public class DroneRepository(ApplicationDbContext context) : BaseRepository<Drone>(context), IDroneRepository
{
    public override async Task<Drone?> GetByIdAsync(long id)
    {
        return await _dbSet
            .Include(d => d.PrimordialDucks)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<IEnumerable<Drone>> GetByTypeAsync(DroneTypeEnum type)
    {
        return await _dbSet
            .Where(d => d.Type == type)
            .ToListAsync();
    }
}