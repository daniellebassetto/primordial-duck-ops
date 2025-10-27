using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Application.Constants;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.Drone;
using PrimordialDuckOperation.Application.Interfaces;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;
using PrimordialDuckOperation.Domain.Interfaces;

namespace PrimordialDuckOperation.Application.Services;

public class DroneService(IDroneRepository repository) : BaseService<IDroneRepository, Drone, DroneResponseDto, CreateDroneRequestDto, UpdateDroneRequestDto, InputFilterDrone>(repository), IDroneService
{
    public override async Task<PagedResult<DroneResponseDto>> SearchAsync(InputFilterDrone filter)
    {
        var query = _repository.GetQueryable();

        if (!string.IsNullOrEmpty(filter.SerialNumber))
            query = query.Where(d => d.SerialNumber.Contains(filter.SerialNumber));
        if (!string.IsNullOrEmpty(filter.Brand))
            query = query.Where(d => d.Brand.Contains(filter.Brand));
        if (!string.IsNullOrEmpty(filter.Manufacturer))
            query = query.Where(d => d.Manufacturer.Contains(filter.Manufacturer));
        if (!string.IsNullOrEmpty(filter.CountryOfOrigin))
            query = query.Where(d => d.CountryOfOrigin.Contains(filter.CountryOfOrigin));
        if (filter.Type.HasValue)
            query = query.Where(d => d.Type == filter.Type.Value);

        if (!string.IsNullOrEmpty(filter.SortBy))
        {
            query = filter.SortBy.ToLower() switch
            {
                DroneConstants.SortFields.SerialNumber => filter.SortDescending ? query.OrderByDescending(d => d.SerialNumber) : query.OrderBy(d => d.SerialNumber),
                DroneConstants.SortFields.Brand => filter.SortDescending ? query.OrderByDescending(d => d.Brand) : query.OrderBy(d => d.Brand),
                DroneConstants.SortFields.Manufacturer => filter.SortDescending ? query.OrderByDescending(d => d.Manufacturer) : query.OrderBy(d => d.Manufacturer),
                _ => query.OrderBy(d => d.Id)
            };
        }
        else
            query = query.OrderBy(d => d.Id);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedResult<DroneResponseDto>
        {
            Data = items.Select(MapToResponseDto),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public override async Task<bool> DeleteAsync(long id)
    {
        var drone = await _repository.GetByIdAsync(id);

        if (drone == null)
            return false;

        if (drone.PrimordialDucks.Count != 0)
            throw new InvalidOperationException(DroneConstants.ErrorMessages.CannotDeleteDroneWithDucks);

        await _repository.DeleteAsync(id);
        return true;
    }

    protected override DroneResponseDto MapToResponseDto(Drone entity) => new()
    {
        Id = entity.Id,
        SerialNumber = entity.SerialNumber,
        Brand = entity.Brand,
        Manufacturer = entity.Manufacturer,
        CountryOfOrigin = entity.CountryOfOrigin,
        Type = entity.Type,
        BatteryLevel = entity.BatteryLevel,
        FuelLevel = entity.FuelLevel,
        Integrity = entity.Integrity,
        IsActive = entity.IsActive,
        IsOperational = entity.IsOperational
    };

    protected override Drone MapToEntity(CreateDroneRequestDto dto) =>
        new(dto.SerialNumber, dto.Brand, dto.Manufacturer, dto.CountryOfOrigin, dto.Type);

    protected override Drone MapToEntityForUpdate(UpdateDroneRequestDto dto, Drone existing)
    {
        existing.Update(dto.SerialNumber, dto.Brand, dto.Manufacturer, dto.CountryOfOrigin);
        return existing;
    }

    public async Task<IEnumerable<DroneResponseDto>> GetByTypeAsync(DroneTypeEnum type)
    {
        var drones = await _repository.GetByTypeAsync(type);
        return drones.Select(MapToResponseDto);
    }

    public async Task<bool> UpdateStatusAsync(long id, UpdateDroneStatusDto dto)
    {
        var drone = await _repository.GetByIdAsync(id);
        if (drone == null)
            return false;

        drone.UpdateStatus(dto.BatteryLevel, dto.FuelLevel, dto.Integrity);
        await _repository.UpdateAsync(drone);
        return true;
    }
}