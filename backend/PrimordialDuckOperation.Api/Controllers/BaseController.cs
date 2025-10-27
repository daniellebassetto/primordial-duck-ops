using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.Interfaces;

namespace PrimordialDuckOperation.Api.Controllers;

[ApiController]
[Authorize]
[Produces("application/json")]
[Consumes("application/json")]
public abstract class BaseController<TService, TResponseDto, TCreateDto, TUpdateDto, TInputFilter>(TService service) : Controller
    where TService : IBaseService<TResponseDto, TCreateDto, TUpdateDto, TInputFilter>
{
    protected readonly TService _service = service;

    [HttpGet]
    public virtual async Task<ActionResult<ApiSuccessResponse<IEnumerable<TResponseDto>>>> GetAll()
    {
        var dtos = await _service.GetAllAsync();
        return Ok(new ApiSuccessResponse<IEnumerable<TResponseDto>> { Data = dtos });
    }

    [HttpPost("search")]
    public virtual async Task<ActionResult<ApiSuccessResponse<PagedResult<TResponseDto>>>> Search([FromBody] TInputFilter filter)
    {
        var result = await _service.SearchAsync(filter);
        return Ok(new ApiSuccessResponse<PagedResult<TResponseDto>> { Data = result });
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(ApiErrorResponse), 500)]
    public virtual async Task<ActionResult<ApiSuccessResponse<TResponseDto>>> GetById(long id)
    {
        var dto = await _service.GetByIdAsync(id);
        if (dto == null)
            return NotFound(new ApiErrorResponse { Message = "Registro não encontrado" });

        return Ok(new ApiSuccessResponse<TResponseDto> { Data = dto });
    }

    [HttpPost]
    public virtual async Task<ActionResult<ApiSuccessResponse<TResponseDto>>> Create([FromBody] TCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(new ApiErrorResponse { Message = "Dados inválidos", Errors = errors });
        }

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = GetEntityId(created) }, new ApiSuccessResponse<TResponseDto> { Data = created });
    }

    [HttpPut("{id:long}")]
    public virtual async Task<ActionResult<ApiSuccessResponse<TResponseDto>>> Update(long id, [FromBody] TUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(new ApiErrorResponse { Message = "Dados inválidos", Errors = errors });
        }

        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null)
            return NotFound(new ApiErrorResponse { Message = "Registro não encontrado" });

        return Ok(new ApiSuccessResponse<TResponseDto> { Data = updated });
    }

    [HttpDelete("{id:long}")]
    public virtual async Task<ActionResult<ApiSuccessResponse>> Delete(long id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new ApiErrorResponse { Message = "Registro não encontrado" });

        return Ok(new ApiSuccessResponse());
    }

    protected virtual object GetEntityId(TResponseDto entity)
    {
        var idProperty = typeof(TResponseDto).GetProperty("Id");
        return idProperty?.GetValue(entity) ?? 0L;
    }
}