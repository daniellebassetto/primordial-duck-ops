using PrimordialDuckOperation.Application.DTOs;

namespace PrimordialDuckOperation.Application.Interfaces;

public interface IBaseService<TResponseDto, TCreateDto, TUpdateDto, TInputFilter>
{
    Task<IEnumerable<TResponseDto>> GetAllAsync();
    Task<PagedResult<TResponseDto>> SearchAsync(TInputFilter filter);
    Task<TResponseDto?> GetByIdAsync(long id);
    Task<TResponseDto> CreateAsync(TCreateDto dto);
    Task<TResponseDto?> UpdateAsync(long id, TUpdateDto dto);
    Task<bool> DeleteAsync(long id);
}