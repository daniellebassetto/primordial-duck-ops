using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.SuperPower;

namespace PrimordialDuckOperation.Application.Interfaces;

public interface ISuperPowerService : IBaseService<SuperPowerResponseDto, CreateSuperPowerRequestDto, UpdateSuperPowerRequestDto, InputFilterSuperPower> { }