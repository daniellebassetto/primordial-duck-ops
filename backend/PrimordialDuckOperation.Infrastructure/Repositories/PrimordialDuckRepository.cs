using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Interfaces;
using PrimordialDuckOperation.Infrastructure.Data;

namespace PrimordialDuckOperation.Infrastructure.Repositories;

public class PrimordialDuckRepository(ApplicationDbContext context) : BaseRepository<PrimordialDuck>(context), IPrimordialDuckRepository
{
    public override async Task<IEnumerable<PrimordialDuck>> GetAllAsync()
    {
        return await _dbSet
            .Include(p => p.Drone)
            .Include(p => p.SuperPower)
            .Include(d => d.CaptureOperations)
            .ToListAsync();
    }

    public override async Task<PrimordialDuck?> GetByIdAsync(long id)
    {
        return await _dbSet
            .Include(p => p.Drone)
            .Include(p => p.SuperPower)
            .Include(d => d.CaptureOperations)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public override IQueryable<PrimordialDuck> GetQueryable()
    {
        return _dbSet
            .Include(d => d.Drone)
            .Include(d => d.SuperPower)
            .Include(d => d.CaptureOperations);
    }

    public async Task<IEnumerable<PrimordialDuck>> GetAvailableForCaptureAsync()
    {
        return await _dbSet
            .Include(p => p.Drone)
            .Include(p => p.SuperPower)
            .Include(p => p.CaptureOperations)
            .Where(p => !p.CaptureOperations.Any(c => c.CaptureResult == Domain.Enums.CaptureResultEnum.Success))
            .ToListAsync();
    }
}