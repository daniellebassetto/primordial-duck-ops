using Microsoft.AspNetCore.Mvc;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.Interfaces;

namespace PrimordialDuckOperation.Api.Controllers;

[Route("api/[controller]")]
public class CaptureOperationsController(ICaptureOperationService service) : BaseController<ICaptureOperationService, CaptureOperationResponseDto, CreateCaptureOperationDto, UpdateCaptureOperationDto, InputFilterCaptureOperation>(service)
{
    [HttpPost("strategy")]
    public async Task<ActionResult<ApiSuccessResponse<CaptureStrategyResponseDto>>> GenerateStrategy([FromBody] CreateCaptureOperationDto dto)
    {
        var strategy = await _service.GenerateStrategyAsync(dto);
        if (strategy == null)
            return BadRequest(new ApiErrorResponse { Message = "Pato ou drone não encontrado ou drone não operacional" });

        return Ok(new ApiSuccessResponse<CaptureStrategyResponseDto> { Data = strategy });
    }

    [HttpPost("{id:long}/start")]
    public async Task<ActionResult<ApiSuccessResponse>> StartOperation(long id)
    {
        var success = await _service.StartOperationAsync(id);
        if (!success)
            return NotFound(new ApiErrorResponse { Message = "Operação não encontrada" });

        return Ok(new ApiSuccessResponse());
    }

    [HttpPost("{id:long}/complete")]
    public async Task<ActionResult<ApiSuccessResponse>> CompleteOperation(long id, [FromBody] CompleteOperationDto dto)
    {
        var success = await _service.CompleteOperationAsync(id, dto);
        if (!success)
            return NotFound(new ApiErrorResponse { Message = "Operação não encontrada" });

        return Ok(new ApiSuccessResponse());
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    public override Task<ActionResult<ApiSuccessResponse>> Delete(long id)
    {
        return base.Delete(id);
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    public override Task<ActionResult<ApiSuccessResponse<CaptureOperationResponseDto>>> Update(long id, [FromBody] UpdateCaptureOperationDto dto)
    {
        return base.Update(id, dto);
    }
}