using Microsoft.AspNetCore.Mvc;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.PrimordialDuck;
using PrimordialDuckOperation.Application.Interfaces;

namespace PrimordialDuckOperation.Api.Controllers;

[Route("api/[controller]")]
public class PrimordialDucksController(IPrimordialDuckService service) : BaseController<IPrimordialDuckService, PrimordialDuckResponseDto, CreatePrimordialDuckRequestDto, UpdatePrimordialDuckRequestDto, InputFilterPrimordialDuck>(service)
{
    [HttpGet("{id:long}/capture-analysis")]
    public async Task<ActionResult<ApiSuccessResponse<CaptureAnalysisResponseDto>>> GetCaptureAnalysis(long id)
    {
        var analysis = await _service.GetCaptureAnalysisAsync(id);
        if (analysis == null)
            return NotFound(new ApiErrorResponse { Message = "Pato Primordial não encontrado" });

        return Ok(new ApiSuccessResponse<CaptureAnalysisResponseDto> { Data = analysis });
    }

    [HttpGet("available-for-capture")]
    public async Task<ActionResult<ApiSuccessResponse<IEnumerable<PrimordialDuckResponseDto>>>> GetAvailableForCapture()
    {
        var ducks = await _service.GetAvailableForCaptureAsync();
        return Ok(new ApiSuccessResponse<IEnumerable<PrimordialDuckResponseDto>> { Data = ducks });
    }
}