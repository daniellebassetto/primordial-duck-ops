using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.Interfaces;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Interfaces;

namespace PrimordialDuckOperation.Application.Services;

public abstract class BaseService<TIBaseRepository, TEntity, TResponseDto, TCreateDto, TUpdateDto, TInputFilter>(TIBaseRepository repository) : IBaseService<TResponseDto, TCreateDto, TUpdateDto, TInputFilter>
    where TEntity : BaseEntity<TEntity>, new()
    where TIBaseRepository : IBaseRepository<TEntity>
{
    protected readonly TIBaseRepository _repository = repository;

    public virtual async Task<IEnumerable<TResponseDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(MapToResponseDto);
    }

    public abstract Task<PagedResult<TResponseDto>> SearchAsync(TInputFilter filter);

    public virtual async Task<TResponseDto?> GetByIdAsync(long id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity == null ? default : MapToResponseDto(entity);
    }

    public virtual async Task<TResponseDto> CreateAsync(TCreateDto dto)
    {
        var entity = MapToEntity(dto);
        var created = await _repository.CreateAsync(entity.SetCreateData());
        return MapToResponseDto(created);
    }

    public virtual async Task<TResponseDto?> UpdateAsync(long id, TUpdateDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return default;

        var entity = MapToEntityForUpdate(dto, existing);
        var updated = await _repository.UpdateAsync(entity.SetUpdateData());
        return MapToResponseDto(updated);
    }

    public virtual async Task<bool> DeleteAsync(long id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return false;

        await _repository.DeleteAsync(id);
        return true;
    }

    protected abstract TResponseDto MapToResponseDto(TEntity entity);
    protected abstract TEntity MapToEntity(TCreateDto dto);
    protected abstract TEntity MapToEntityForUpdate(TUpdateDto dto, TEntity existing);
}