using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Domain.Interfaces;
using PrimordialDuckOperation.Infrastructure.Data;

namespace PrimordialDuckOperation.Infrastructure.Repositories;

public class BaseRepository<T>(ApplicationDbContext context) : IBaseRepository<T> where T : class
{
    protected readonly ApplicationDbContext _context = context;
    protected readonly DbSet<T> _dbSet = context.Set<T>();

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<T?> GetByIdAsync(long id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<T> CreateAsync(T entity)
    {
        _dbSet.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        var entry = _context.Entry(entity);

        if (entry.State == EntityState.Detached)
            _dbSet.Update(entity);

        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task DeleteAsync(long id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public virtual IQueryable<T> GetQueryable()
    {
        return _dbSet.AsQueryable();
    }
}