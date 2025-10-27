export const HibernationStatus = {
  AWAKE: 1,
  IN_TRANCE: 2,
  DEEP_HIBERNATION: 3
};

export const DroneType = {
  IDENTIFICATION: 1,
  COMBAT: 2
};

export const HeightUnit = {
  CENTIMETERS: 1,
  FEET: 2
};

export const WeightUnit = {
  GRAMS: 1,
  POUNDS: 2
};

export const GpsPrecisionUnit = {
  CENTIMETERS: 1,
  METERS: 2,
  YARDS: 3
};

export const SuperPowerClassification = {
  WARLIKE: 1,
  DEFENSIVE: 2,
  ELEMENTAL: 3,
  PSYCHIC: 4,
  TECHNOLOGICAL: 5,
  BIOLOGICAL: 6,
  TEMPORAL: 7,
  DIMENSIONAL: 8
};

export const CaptureResult = {
  SUCCESS: 1,
  ESCAPED: 2,
  FAILED: 3,
  DRONE_DESTROYED: 4
};

export const CaptureStatus = {
  PREPARING: 1,
  IN_PROGRESS: 2,
  SUCCESS: 3,
  FAILED: 4,
  ABORTED: 5
};

export const getHibernationStatusName = (status) => {
  const statusMap = {
    [HibernationStatus.AWAKE]: 'Desperto',
    [HibernationStatus.IN_TRANCE]: 'Em Transe',
    [HibernationStatus.DEEP_HIBERNATION]: 'Hibernação Profunda'
  };
  return statusMap[status] || 'Desperto';
};

export const getHibernationStatusClass = (status) => {
  const statusMap = {
    [HibernationStatus.AWAKE]: 'status-desperto',
    [HibernationStatus.IN_TRANCE]: 'status-transe',
    [HibernationStatus.DEEP_HIBERNATION]: 'status-hibernacao'
  };
  return statusMap[status] || 'status-desperto';
};

export const getClassificationName = (classification) => {
  const names = {
    [SuperPowerClassification.WARLIKE]: 'Bélico',
    [SuperPowerClassification.DEFENSIVE]: 'Defensivo',
    [SuperPowerClassification.ELEMENTAL]: 'Elemental',
    [SuperPowerClassification.PSYCHIC]: 'Psíquico',
    [SuperPowerClassification.TECHNOLOGICAL]: 'Tecnológico',
    [SuperPowerClassification.BIOLOGICAL]: 'Biológico',
    [SuperPowerClassification.TEMPORAL]: 'Temporal',
    [SuperPowerClassification.DIMENSIONAL]: 'Dimensional'
  };
  return names[classification] || classification;
};

export const getCaptureStatusName = (status) => {
  const statusMap = {
    [CaptureStatus.PREPARING]: 'Preparando',
    [CaptureStatus.IN_PROGRESS]: 'Em Andamento',
    [CaptureStatus.SUCCESS]: 'Sucesso',
    [CaptureStatus.FAILED]: 'Falhou',
    [CaptureStatus.ABORTED]: 'Abortada'
  };
  return statusMap[status] || 'Desconhecido';
};

export const getCaptureResultName = (result) => {
  const resultMap = {
    [CaptureResult.SUCCESS]: 'Captura realizada com sucesso',
    [CaptureResult.ESCAPED]: 'O pato escapou',
    [CaptureResult.FAILED]: 'Captura falhou',
    [CaptureResult.DRONE_DESTROYED]: 'Drone foi destruído'
  };
  return resultMap[result] || 'Resultado desconhecido';
};