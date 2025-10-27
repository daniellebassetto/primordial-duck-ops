using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Application.Constants;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.Interfaces;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;
using PrimordialDuckOperation.Domain.Interfaces;

namespace PrimordialDuckOperation.Application.Services;

public class CaptureOperationService(ICaptureOperationRepository captureOperationRepository, IDroneRepository droneRepository, IPrimordialDuckRepository duckRepository, CaptureStrategyService strategyService) : BaseService<ICaptureOperationRepository, CaptureOperation, CaptureOperationResponseDto, CreateCaptureOperationDto, UpdateCaptureOperationDto, InputFilterCaptureOperation>(captureOperationRepository), ICaptureOperationService
{
    private readonly IDroneRepository _droneRepository = droneRepository;
    private readonly IPrimordialDuckRepository _duckRepository = duckRepository;
    private readonly CaptureStrategyService _strategyService = strategyService;

    public override async Task<PagedResult<CaptureOperationResponseDto>> SearchAsync(InputFilterCaptureOperation filter)
    {
        var query = _repository.GetQueryable();

        if (filter.Status.HasValue)
            query = query.Where(o => o.Status == filter.Status.Value);
        if (filter.PrimordialDuckId.HasValue)
            query = query.Where(o => o.PrimordialDuckId == filter.PrimordialDuckId.Value);
        if (filter.DroneId.HasValue)
            query = query.Where(o => o.DroneId == filter.DroneId.Value);
        if (filter.StartDateFrom.HasValue)
            query = query.Where(o => o.StartTime >= filter.StartDateFrom.Value);
        if (filter.StartDateTo.HasValue)
            query = query.Where(o => o.StartTime <= filter.StartDateTo.Value);
        if (filter.MinSuccessChance.HasValue)
            query = query.Where(o => o.SuccessChance >= filter.MinSuccessChance.Value);
        if (filter.MaxSuccessChance.HasValue)
            query = query.Where(o => o.SuccessChance <= filter.MaxSuccessChance.Value);

        if (!string.IsNullOrEmpty(filter.SortBy))
        {
            query = filter.SortBy.ToLower() switch
            {
                CaptureOperationConstants.SortFields.StartTime => filter.SortDescending ? query.OrderByDescending(o => o.StartTime) : query.OrderBy(o => o.StartTime),
                CaptureOperationConstants.SortFields.Status => filter.SortDescending ? query.OrderByDescending(o => o.Status) : query.OrderBy(o => o.Status),
                CaptureOperationConstants.SortFields.SuccessChance => filter.SortDescending ? query.OrderByDescending(o => o.SuccessChance) : query.OrderBy(o => o.SuccessChance),
                _ => query.OrderByDescending(o => o.StartTime)
            };
        }
        else
            query = query.OrderByDescending(o => o.StartTime);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedResult<CaptureOperationResponseDto>
        {
            Data = items.Select(MapToResponseDto),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<CaptureStrategyResponseDto?> GenerateStrategyAsync(CreateCaptureOperationDto dto)
    {
        var duck = await _duckRepository.GetByIdAsync(dto.PrimordialDuckId);
        var drone = await _droneRepository.GetByIdAsync(dto.DroneId);

        if (duck == null || drone == null)
            return null;

        var hasOperation = await _repository.HasOperationsByDuckIdAsync(dto.PrimordialDuckId);

        if (hasOperation)
            throw new InvalidOperationException(CaptureOperationConstants.ErrorMessages.DuckAlreadyHasOperation);

        var strategy = _strategyService.GenerateStrategy(duck, drone);

        return new CaptureStrategyResponseDto
        {
            Strategy = GetStrategyDescription(strategy.Strategy),
            DefenseGenerated = GetDefenseDescription(strategy.DefenseGenerated),
            SuccessChance = strategy.SuccessChance,
            Reasoning = strategy.Reasoning
        };
    }

    public override async Task<CaptureOperationResponseDto> CreateAsync(CreateCaptureOperationDto dto)
    {
        var duck = await _duckRepository.GetByIdAsync(dto.PrimordialDuckId);
        var drone = await _droneRepository.GetByIdAsync(dto.DroneId);

        if (duck == null || drone == null)
            throw new InvalidOperationException(CaptureOperationConstants.ErrorMessages.DuckOrDroneNotFound);

        var strategy = _strategyService.GenerateStrategy(duck, drone);

        var operation = new CaptureOperation(
            dto.PrimordialDuckId,
            dto.DroneId,
            strategy.Strategy,
            strategy.DefenseGenerated,
            strategy.SuccessChance);

        var created = await _repository.CreateAsync(operation.SetCreateData());
        return MapToResponseDto(created);
    }

    public async Task<bool> StartOperationAsync(long operationId)
    {
        var operation = await _repository.GetByIdAsync(operationId);
        if (operation == null)
            return false;

        operation.StartOperation();
        await _repository.UpdateAsync(operation);
        return true;
    }

    public async Task<bool> CompleteOperationAsync(long operationId, CompleteOperationDto dto)
    {
        var operation = await _repository.GetByIdAsync(operationId);
        if (operation == null)
            return false;

        operation.CompleteOperation(dto.CaptureResult);
        await _repository.UpdateAsync(operation);
        return true;
    }

    protected override CaptureOperationResponseDto MapToResponseDto(CaptureOperation entity)
    {
        return new CaptureOperationResponseDto
        {
            Id = entity.Id,
            PrimordialDuckId = entity.PrimordialDuckId,
            DroneId = entity.DroneId,
            Status = entity.Status,
            SuccessChance = entity.SuccessChance,
            StartTime = entity.StartTime,
            EndTime = entity.EndTime,
            Strategy = GetStrategyDescription(entity.Strategy),
            DefenseGenerated = GetDefenseDescription(entity.DefenseGenerated),
            Result = entity.CaptureResult.HasValue ? GetResultDescription(entity.CaptureResult.Value) : null,
            CaptureResult = entity.CaptureResult,
            IsAutoGuided = entity.IsAutoGuided,
            Drone = entity.Drone != null ? new DroneResponseDto
            {
                Id = entity.Drone.Id,
                SerialNumber = entity.Drone.SerialNumber,
                Manufacturer = entity.Drone.Manufacturer,
                Brand = entity.Drone.Brand,
                CountryOfOrigin = entity.Drone.CountryOfOrigin,
                Type = entity.Drone.Type,
                BatteryLevel = entity.Drone.BatteryLevel,
                FuelLevel = entity.Drone.FuelLevel,
                Integrity = entity.Drone.Integrity,
                IsActive = entity.Drone.IsActive,
                IsOperational = entity.Drone.IsOperational
            } : null,
            PrimordialDuck = entity.PrimordialDuck != null ? new PrimordialDuckResponseDto
            {
                Id = entity.PrimordialDuck.Id,
                Nickname = entity.PrimordialDuck.Nickname,
                Drone = entity.PrimordialDuck.Drone != null ? new DroneResponseDto
                {
                    Id = entity.PrimordialDuck.Drone.Id,
                    SerialNumber = entity.PrimordialDuck.Drone.SerialNumber,
                    Brand = entity.PrimordialDuck.Drone.Brand,
                    Manufacturer = entity.PrimordialDuck.Drone.Manufacturer,
                    CountryOfOrigin = entity.PrimordialDuck.Drone.CountryOfOrigin
                } : null,
                HeightValue = entity.PrimordialDuck.Height.Value,
                HeightUnit = entity.PrimordialDuck.Height.Unit,
                WeightValue = entity.PrimordialDuck.Weight?.Value ?? 0,
                WeightUnit = entity.PrimordialDuck.Weight?.Unit ?? WeightUnitEnum.Grams,
                Location = new LocationResponseDto
                {
                    CityName = entity.PrimordialDuck.Location.CityName,
                    Country = entity.PrimordialDuck.Location.Country,
                    Latitude = entity.PrimordialDuck.Location.Latitude,
                    Longitude = entity.PrimordialDuck.Location.Longitude,
                    ReferencePoint = entity.PrimordialDuck.Location.ReferencePoint
                },
                GpsPrecisionValue = entity.PrimordialDuck.GpsPrecision.Value,
                GpsPrecisionUnit = entity.PrimordialDuck.GpsPrecision.Unit,
                HibernationStatus = entity.PrimordialDuck.HibernationStatus,
                HeartRate = entity.PrimordialDuck.HeartRate,
                MutationCount = entity.PrimordialDuck.MutationCount,
                SuperPower = entity.PrimordialDuck.SuperPower != null ? new SuperPowerResponseDto
                {
                    Id = entity.PrimordialDuck.SuperPower.Id,
                    Name = entity.PrimordialDuck.SuperPower.Name,
                    Description = entity.PrimordialDuck.SuperPower.Description,
                    Classification = entity.PrimordialDuck.SuperPower.Classification
                } : null,
                DiscoveredAt = entity.PrimordialDuck.DiscoveredAt,
                IsCaptured = entity.PrimordialDuck.IsCaptured,
                CaptureDate = entity.PrimordialDuck.CaptureDate
            } : null
        };
    }

    protected override CaptureOperation MapToEntity(CreateCaptureOperationDto dto)
    {
        throw new NotImplementedException("Use CreateAsync method instead");
    }

    protected override CaptureOperation MapToEntityForUpdate(UpdateCaptureOperationDto dto, CaptureOperation existing)
    {
        if (dto.CaptureResult.HasValue)
            existing.CompleteOperation(dto.CaptureResult.Value);
        return existing;
    }

    private static string GetStrategyDescription(CaptureStrategyEnum strategy)
    {
        return strategy switch
        {
            CaptureStrategyEnum.SteathApproach => CaptureOperationConstants.StrategyDescriptions.StealthApproach,
            CaptureStrategyEnum.DirectAssault => CaptureOperationConstants.StrategyDescriptions.DirectAssault,
            CaptureStrategyEnum.TrapDeployment => CaptureOperationConstants.StrategyDescriptions.TrapDeployment,
            CaptureStrategyEnum.DistractionTactic => CaptureOperationConstants.StrategyDescriptions.DistractionTactic,
            CaptureStrategyEnum.AerialBombardment => CaptureOperationConstants.StrategyDescriptions.AerialBombardment,
            CaptureStrategyEnum.UnderwaterAmbush => CaptureOperationConstants.StrategyDescriptions.UnderwaterAmbush,
            CaptureStrategyEnum.TacticalSiege => CaptureOperationConstants.StrategyDescriptions.TacticalSiege,
            CaptureStrategyEnum.SilentInfiltration => CaptureOperationConstants.StrategyDescriptions.SilentInfiltration,
            CaptureStrategyEnum.LightningStrike => CaptureOperationConstants.StrategyDescriptions.LightningStrike,
            CaptureStrategyEnum.FlankingManeuver => CaptureOperationConstants.StrategyDescriptions.FlankingManeuver,
            CaptureStrategyEnum.AreaSuppression => CaptureOperationConstants.StrategyDescriptions.AreaSuppression,
            CaptureStrategyEnum.HolographicDecoy => CaptureOperationConstants.StrategyDescriptions.HolographicDecoy,
            CaptureStrategyEnum.SonicPulse => CaptureOperationConstants.StrategyDescriptions.SonicPulse,
            CaptureStrategyEnum.ContainmentNet => CaptureOperationConstants.StrategyDescriptions.ContainmentNet,
            CaptureStrategyEnum.GravityInversion => CaptureOperationConstants.StrategyDescriptions.GravityInversion,
            _ => CaptureOperationConstants.StrategyDescriptions.Unknown
        };
    }

    private static string GetDefenseDescription(DefenseTypeEnum defense)
    {
        return defense switch
        {
            DefenseTypeEnum.EnergyShield => CaptureOperationConstants.DefenseDescriptions.EnergyShield,
            DefenseTypeEnum.CamouflageField => CaptureOperationConstants.DefenseDescriptions.CamouflageField,
            DefenseTypeEnum.TeleportationBurst => CaptureOperationConstants.DefenseDescriptions.TeleportationBurst,
            DefenseTypeEnum.PsychicBarrier => CaptureOperationConstants.DefenseDescriptions.PsychicBarrier,
            DefenseTypeEnum.ElementalWard => CaptureOperationConstants.DefenseDescriptions.ElementalWard,
            DefenseTypeEnum.TimeDistortion => CaptureOperationConstants.DefenseDescriptions.TimeDistortion,
            DefenseTypeEnum.BiologicalArmor => CaptureOperationConstants.DefenseDescriptions.BiologicalArmor,
            DefenseTypeEnum.QuantumReflection => CaptureOperationConstants.DefenseDescriptions.QuantumReflection,
            DefenseTypeEnum.KineticAbsorption => CaptureOperationConstants.DefenseDescriptions.KineticAbsorption,
            DefenseTypeEnum.MagneticField => CaptureOperationConstants.DefenseDescriptions.MagneticField,
            DefenseTypeEnum.NeuralInterference => CaptureOperationConstants.DefenseDescriptions.NeuralInterference,
            DefenseTypeEnum.PlasmaDome => CaptureOperationConstants.DefenseDescriptions.PlasmaDome,
            DefenseTypeEnum.DefensiveCloning => CaptureOperationConstants.DefenseDescriptions.DefensiveCloning,
            DefenseTypeEnum.DimensionalPrison => CaptureOperationConstants.DefenseDescriptions.DimensionalPrison,
            DefenseTypeEnum.AcceleratedRegeneration => CaptureOperationConstants.DefenseDescriptions.AcceleratedRegeneration,
            _ => CaptureOperationConstants.DefenseDescriptions.Unknown
        };
    }

    private static string GetResultDescription(CaptureResultEnum result)
    {
        return result switch
        {
            CaptureResultEnum.Success => CaptureOperationConstants.ResultDescriptions.Success,
            CaptureResultEnum.Failed => CaptureOperationConstants.ResultDescriptions.Failed,
            CaptureResultEnum.Escaped => CaptureOperationConstants.ResultDescriptions.Escaped,
            CaptureResultEnum.DroneDestroyed => CaptureOperationConstants.ResultDescriptions.DroneDestroyed,
            _ => CaptureOperationConstants.ResultDescriptions.Unknown
        };
    }
}