using Microsoft.AspNetCore.Mvc;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.SuperPower;
using PrimordialDuckOperation.Application.Interfaces;

namespace PrimordialDuckOperation.Api.Controllers;

[Route("api/[controller]")]
public class SuperPowersController(ISuperPowerService service) : BaseController<ISuperPowerService, SuperPowerResponseDto, CreateSuperPowerRequestDto, UpdateSuperPowerRequestDto, InputFilterSuperPower>(service) { }