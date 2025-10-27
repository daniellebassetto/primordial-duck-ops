using Microsoft.EntityFrameworkCore;
using PrimordialDuckOperation.Application.Constants;
using PrimordialDuckOperation.Application.DTOs;
using PrimordialDuckOperation.Application.DTOs.PrimordialDuck;
using PrimordialDuckOperation.Application.Interfaces;
using PrimordialDuckOperation.Domain.Entities;
using PrimordialDuckOperation.Domain.Enums;
using PrimordialDuckOperation.Domain.Interfaces;
using PrimordialDuckOperation.Domain.ValueObjects;

namespace PrimordialDuckOperation.Application.Services;

public class PrimordialDuckService(IPrimordialDuckRepository primordialDuckRepository, ICaptureOperationRepository captureOperationRepository, IDroneRepository droneRepository, ISuperPowerRepository superPowerRepository) : BaseService<IPrimordialDuckRepository, PrimordialDuck, PrimordialDuckResponseDto, CreatePrimordialDuckRequestDto, UpdatePrimordialDuckRequestDto, InputFilterPrimordialDuck>(primordialDuckRepository), IPrimordialDuckService
{
    private readonly ICaptureOperationRepository _captureOperationRepository = captureOperationRepository;
    private readonly IDroneRepository _droneRepository = droneRepository;
    private readonly ISuperPowerRepository _superPowerRepository = superPowerRepository;
    public override async Task<IEnumerable<PrimordialDuckResponseDto>> GetAllAsync()
    {
        var query = await _repository.GetAllAsync();
        return query.Select(MapToResponseDto);
    }

    public override async Task<PagedResult<PrimordialDuckResponseDto>> SearchAsync(InputFilterPrimordialDuck filter)
    {
        IQueryable<PrimordialDuck> query = _repository.GetQueryable();

        if (!string.IsNullOrEmpty(filter.CityName))
            query = query.Where(d => d.Location.CityName.Contains(filter.CityName));
        if (!string.IsNullOrEmpty(filter.Country))
            query = query.Where(d => d.Location.Country.Contains(filter.Country));
        if (filter.HibernationStatus.HasValue)
            query = query.Where(d => (int)d.HibernationStatus == filter.HibernationStatus.Value);
        if (filter.MinMutationCount.HasValue)
            query = query.Where(d => d.MutationCount >= filter.MinMutationCount.Value);
        if (filter.MaxMutationCount.HasValue)
            query = query.Where(d => d.MutationCount <= filter.MaxMutationCount.Value);
        if (filter.SuperPowerId.HasValue)
            query = query.Where(d => d.SuperPowerId == filter.SuperPowerId.Value);
        if (filter.IsCaptured.HasValue)
            query = query.Where(d => d.CaptureOperations.Any(c => c.CaptureResult == Domain.Enums.CaptureResultEnum.Success) == filter.IsCaptured.Value);

        if (!string.IsNullOrEmpty(filter.SortBy))
        {
            query = filter.SortBy.ToLower() switch
            {
                PrimordialDuckConstants.SortFields.HibernationStatus => filter.SortDescending ? query.OrderByDescending(d => d.HibernationStatus) : query.OrderBy(d => d.HibernationStatus),
                PrimordialDuckConstants.SortFields.MutationCount => filter.SortDescending ? query.OrderByDescending(d => d.MutationCount) : query.OrderBy(d => d.MutationCount),
                PrimordialDuckConstants.SortFields.DiscoveredAt => filter.SortDescending ? query.OrderByDescending(d => d.DiscoveredAt) : query.OrderBy(d => d.DiscoveredAt),
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

        return new PagedResult<PrimordialDuckResponseDto>
        {
            Data = items.Select(MapToResponseDto),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public override async Task<PrimordialDuckResponseDto?> GetByIdAsync(long id)
    {
        var duck = await _repository.GetByIdAsync(id);
        return duck != null ? MapToResponseDto(duck) : null;
    }

    protected override PrimordialDuck MapToEntity(CreatePrimordialDuckRequestDto dto)
    {
        if (dto.HeightUnit == HeightUnitEnum.Centimeters &&
            (dto.HeightValue < PrimordialDuckConstants.ValidationRanges.MinHeightCentimeters ||
             dto.HeightValue > PrimordialDuckConstants.ValidationRanges.MaxHeightCentimeters))
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.HeightCentimetersOutOfRange);

        if (dto.HeightUnit == HeightUnitEnum.Feet &&
            (dto.HeightValue < PrimordialDuckConstants.ValidationRanges.MinHeightFeet ||
             dto.HeightValue > PrimordialDuckConstants.ValidationRanges.MaxHeightFeet))
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.HeightFeetOutOfRange);

        if (dto.WeightUnit == WeightUnitEnum.Grams &&
            (dto.WeightValue < PrimordialDuckConstants.ValidationRanges.MinWeightGrams ||
             dto.WeightValue > PrimordialDuckConstants.ValidationRanges.MaxWeightGrams))
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.WeightGramsOutOfRange);

        if (dto.WeightUnit == WeightUnitEnum.Pounds &&
            (dto.WeightValue < PrimordialDuckConstants.ValidationRanges.MinWeightPounds ||
             dto.WeightValue > PrimordialDuckConstants.ValidationRanges.MaxWeightPounds))
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.WeightPoundsOutOfRange);

        if (dto.GpsPrecisionUnit == PrecisionUnitEnum.Centimeters &&
            (dto.GpsPrecisionValue < PrimordialDuckConstants.ValidationRanges.MinGpsPrecisionCentimeters ||
             dto.GpsPrecisionValue > PrimordialDuckConstants.ValidationRanges.MaxGpsPrecisionCentimeters))
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.GpsPrecisionCentimetersOutOfRange);

        if (dto.GpsPrecisionUnit == PrecisionUnitEnum.Meters &&
            (dto.GpsPrecisionValue < PrimordialDuckConstants.ValidationRanges.MinGpsPrecisionMeters ||
             dto.GpsPrecisionValue > PrimordialDuckConstants.ValidationRanges.MaxGpsPrecisionMeters))
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.GpsPrecisionMetersOutOfRange);

        if (dto.GpsPrecisionUnit == PrecisionUnitEnum.Yards &&
            (dto.GpsPrecisionValue < PrimordialDuckConstants.ValidationRanges.MinGpsPrecisionYards ||
             dto.GpsPrecisionValue > PrimordialDuckConstants.ValidationRanges.MaxGpsPrecisionYards))
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.GpsPrecisionYardsOutOfRange);

        var drone = _droneRepository.GetByIdAsync(dto.DroneId).Result ?? throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.DroneNotFound);

        if (drone.Type != DroneTypeEnum.Identification)
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.OnlyIdentificationDronesAllowed);

        if (dto.SuperPowerId.HasValue)
            _ = _superPowerRepository.GetByIdAsync(dto.SuperPowerId.Value).Result ?? throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.SuperPowerNotFound);

        if (dto.HibernationStatus == HibernationStatusEnum.Awake && !dto.SuperPowerId.HasValue)
            throw new ArgumentException(PrimordialDuckConstants.ErrorMessages.AwakeDuckRequiresSuperPower);

        var height = new HeightMeasurement { Value = dto.HeightValue, Unit = dto.HeightUnit };
        var weight = new WeightMeasurement { Value = dto.WeightValue, Unit = dto.WeightUnit };
        var location = new Location
        {
            CityName = dto.CityName,
            Country = dto.Country,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            ReferencePoint = dto.ReferencePoint
        };
        var precision = new PrecisionMeasurement { Value = dto.GpsPrecisionValue, Unit = dto.GpsPrecisionUnit };

        return new PrimordialDuck(
            dto.DroneId,
            height,
            weight,
            location,
            precision,
            dto.HibernationStatus,
            dto.MutationCount,
            dto.HeartRate,
            dto.SuperPowerId,
            dto.Nickname);
    }

    protected override PrimordialDuck MapToEntityForUpdate(UpdatePrimordialDuckRequestDto dto, PrimordialDuck existing)
    {
        existing.SetProperty(nameof(PrimordialDuck.Nickname), dto.Nickname)
               .SetProperty(nameof(PrimordialDuck.Height), new HeightMeasurement { Value = dto.HeightValue, Unit = dto.HeightUnit })
               .SetProperty(nameof(PrimordialDuck.Weight), new WeightMeasurement { Value = dto.WeightValue, Unit = dto.WeightUnit })
               .SetProperty(nameof(PrimordialDuck.Location), new Location { CityName = dto.CityName, Country = dto.Country, Latitude = dto.Latitude, Longitude = dto.Longitude, ReferencePoint = dto.ReferencePoint })
               .SetProperty(nameof(PrimordialDuck.GpsPrecision), new PrecisionMeasurement { Value = dto.GpsPrecisionValue, Unit = dto.GpsPrecisionUnit })
               .SetProperty(nameof(PrimordialDuck.HibernationStatus), dto.HibernationStatus)
               .SetProperty(nameof(PrimordialDuck.HeartRate), dto.HeartRate)
               .SetProperty(nameof(PrimordialDuck.MutationCount), dto.MutationCount)
               .SetProperty(nameof(PrimordialDuck.SuperPowerId), dto.SuperPowerId);

        return existing;
    }

    public async Task<CaptureAnalysisResponseDto?> GetCaptureAnalysisAsync(long id)
    {
        var duck = await _repository.GetByIdAsync(id);

        if (duck == null)
            return null;

        var analysis = CaptureAnalysisService.AnalyzeCaptureOperation(duck);

        return new CaptureAnalysisResponseDto
        {
            OperationalCost = analysis.OperationalCost,
            MilitaryPower = analysis.MilitaryPower,
            RiskLevel = analysis.RiskLevel,
            ScientificValue = analysis.ScientificValue,
            OverallScore = analysis.OverallScore,
            DistanceFromBase = analysis.DistanceFromBase,
            Classification = analysis.Classification,
            RiskFactors = analysis.RiskFactors,
            ValueFactors = analysis.ValueFactors
        };
    }

    protected override PrimordialDuckResponseDto MapToResponseDto(PrimordialDuck duck)
    {
        return new PrimordialDuckResponseDto
        {
            Id = duck.Id,
            Nickname = duck.Nickname,
            Drone = duck.Drone != null ? new DroneResponseDto
            {
                Id = duck.Drone.Id,
                SerialNumber = duck.Drone.SerialNumber,
                Brand = duck.Drone.Brand,
                Manufacturer = duck.Drone.Manufacturer,
                CountryOfOrigin = duck.Drone.CountryOfOrigin
            } : null,
            HeightValue = duck.Height.Value,
            HeightUnit = duck.Height.Unit,
            WeightValue = duck.Weight?.Value ?? 0,
            WeightUnit = duck.Weight?.Unit ?? WeightUnitEnum.Grams,
            Location = new LocationResponseDto
            {
                CityName = duck.Location.CityName,
                Country = duck.Location.Country,
                Latitude = duck.Location.Latitude,
                Longitude = duck.Location.Longitude,
                ReferencePoint = duck.Location.ReferencePoint
            },
            GpsPrecisionValue = duck.GpsPrecision.Value,
            GpsPrecisionUnit = duck.GpsPrecision.Unit,
            HibernationStatus = duck.HibernationStatus,
            HeartRate = duck.HeartRate,
            MutationCount = duck.MutationCount,
            SuperPower = duck.SuperPower != null ? new SuperPowerResponseDto
            {
                Id = duck.SuperPower.Id,
                Name = duck.SuperPower.Name,
                Description = duck.SuperPower.Description,
                Classification = duck.SuperPower.Classification
            } : null,
            DiscoveredAt = duck.DiscoveredAt,
            IsCaptured = duck.IsCaptured,
            CaptureDate = duck.CaptureDate
        };
    }

    public override async Task<bool> DeleteAsync(long id)
    {
        var duck = await _repository.GetByIdAsync(id);

        if (duck == null)
            return false;

        var hasOperation = await _captureOperationRepository.HasOperationsByDuckIdAsync(id);
        if (hasOperation)
            throw new InvalidOperationException(PrimordialDuckConstants.ErrorMessages.CannotDeleteDuckWithOperations);

        await _repository.DeleteAsync(id);
        return true;
    }

    public async Task<IEnumerable<PrimordialDuckResponseDto>> GetAvailableForCaptureAsync()
    {
        var ducks = await _repository.GetAvailableForCaptureAsync();
        return ducks.Select(MapToResponseDto);
    }
}