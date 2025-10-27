using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Interfaces;
using PrimordialDuckOperation.Infrastructure.Data;

namespace PrimordialDuckOperation.Infrastructure.Repositories;

public class CaptureOperationRepository(ApplicationDbContext context) : BaseRepository<CaptureOperation>(context), ICaptureOperationRepository
{
    public override async Task<CaptureOperation?> GetByIdAsync(long id)
    {
        return await _dbSet
            .Include(c => c.PrimordialDuck)
            .Include(c => c.Drone)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public override async Task<IEnumerable<CaptureOperation>> GetAllAsync()
    {
        return await _dbSet
            .Include(c => c.PrimordialDuck)
            .Include(c => c.Drone)
            .OrderByDescending(c => c.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<CaptureOperation>> GetByStatusAsync(Domain.Enums.CaptureStatus status)
    {
        return await _dbSet
            .Include(c => c.PrimordialDuck)
            .Include(c => c.Drone)
            .Where(c => c.Status == status)
            .OrderByDescending(c => c.StartTime)
            .ToListAsync();
    }

    public async Task<bool> HasOperationsByDuckIdAsync(long duckId)
    {
        return await _dbSet
            .AnyAsync(op => op.PrimordialDuckId == duckId);
    }
}