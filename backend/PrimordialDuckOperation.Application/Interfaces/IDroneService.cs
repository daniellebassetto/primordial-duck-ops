using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.Drone;
using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Application.Interfaces;

public interface IDroneService : IBaseService<DroneResponseDto, CreateDroneRequestDto, UpdateDroneRequestDto, InputFilterDrone>
{
    Task<IEnumerable<DroneResponseDto>> GetByTypeAsync(DroneTypeEnum type);
    Task<bool> UpdateStatusAsync(long id, UpdateDroneStatusDto dto);
}