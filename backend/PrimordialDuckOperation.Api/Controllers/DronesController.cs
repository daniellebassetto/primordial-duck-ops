using Microsoft.AspNetCore.Mvc;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.Drone;
using PrimordialDuckOperation.Application.Interfaces;
using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Api.Controllers;

[Route("api/[controller]")]
public class DronesController(IDroneService service) : BaseController<IDroneService, DroneResponseDto, CreateDroneRequestDto, UpdateDroneRequestDto, InputFilterDrone>(service)
{
    [HttpGet("by-type/{type}")]
    public async Task<ActionResult<ApiSuccessResponse<IEnumerable<DroneResponseDto>>>> GetByType(DroneTypeEnum type)
    {
        var drones = await _service.GetByTypeAsync(type);
        return Ok(new ApiSuccessResponse<IEnumerable<DroneResponseDto>> { Data = drones });
    }

    [HttpPut("{id:long}/status")]
    public async Task<ActionResult<ApiSuccessResponse<bool>>> UpdateStatus(long id, [FromBody] UpdateDroneStatusDto dto)
    {
        var result = await _service.UpdateStatusAsync(id, dto);
        if (!result)
            return NotFound(new ApiErrorResponse { Message = "Drone não encontrado" });
        return Ok(new ApiSuccessResponse<bool> { Data = true });
    }
}