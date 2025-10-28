using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Application.Constants;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.SuperPower;
using PrimordialDuckOperation.Application.Interfaces;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;
using PrimordialDuckOperation.Domain.Interfaces;

namespace PrimordialDuckOperation.Application.Services;

public class SuperPowerService(ISuperPowerRepository repository) : BaseService<ISuperPowerRepository, SuperPower, SuperPowerResponseDto, CreateSuperPowerRequestDto, UpdateSuperPowerRequestDto, InputFilterSuperPower>(repository), ISuperPowerService
{
    public override async Task<PagedResult<SuperPowerResponseDto>> SearchAsync(InputFilterSuperPower filter)
    {
        var query = _repository.GetQueryable();

        if (!string.IsNullOrEmpty(filter.Name))
            query = query.Where(s => s.Name.Contains(filter.Name));
        if (!string.IsNullOrEmpty(filter.Description))
            query = query.Where(s => s.Description.Contains(filter.Description));
        if (filter.Classification.HasValue)
            query = query.Where(s => (int)s.Classification == filter.Classification.Value);

        if (!string.IsNullOrEmpty(filter.SortBy))
        {
            query = filter.SortBy.ToLower() switch
            {
                "name" => filter.SortDescending ? query.OrderByDescending(s => s.Name) : query.OrderBy(s => s.Name),
                "classification" => filter.SortDescending ? query.OrderByDescending(s => s.Classification) : query.OrderBy(s => s.Classification),
                _ => query.OrderBy(s => s.Id)
            };
        }
        else
            query = query.OrderBy(s => s.Id);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedResult<SuperPowerResponseDto>
        {
            Data = items.Select(MapToResponseDto),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public override async Task<bool> DeleteAsync(long id)
    {
        var superPower = await _repository.GetByIdAsync(id);

        if (superPower == null)
            return false;

        if (superPower.PrimordialDucks.Count != 0)
            throw new InvalidOperationException(SuperPowerConstants.ErrorMessages.CannotDeleteSuperPowerWithDucks);

        await _repository.DeleteAsync(id);
        return true;
    }

    protected override SuperPowerResponseDto MapToResponseDto(SuperPower entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Description = entity.Description,
        Classification = entity.Classification
    };

    protected override SuperPower MapToEntity(CreateSuperPowerRequestDto dto) =>
        new(dto.Name, dto.Description, (SuperPowerClassificationEnum)dto.Classification);

    protected override SuperPower MapToEntityForUpdate(UpdateSuperPowerRequestDto dto, SuperPower existing)
    {
        existing.SetProperty(nameof(SuperPower.Name), dto.Name)
               .SetProperty(nameof(SuperPower.Description), dto.Description)
               .SetProperty(nameof(SuperPower.Classification), dto.Classification);

        return existing;
    }
}