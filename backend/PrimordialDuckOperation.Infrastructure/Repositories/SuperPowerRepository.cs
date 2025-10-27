using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Interfaces;
using PrimordialDuckOperation.Infrastructure.Data;

namespace PrimordialDuckOperation.Infrastructure.Repositories;

public class SuperPowerRepository(ApplicationDbContext context) : BaseRepository<SuperPower>(context), ISuperPowerRepository
{
    public override async Task<SuperPower?> GetByIdAsync(long id)
    {
        return await _dbSet
            .Include(d => d.PrimordialDucks)
            .FirstOrDefaultAsync(d => d.Id == id);
    }
}