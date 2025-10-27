import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Edit } from 'lucide-react';
import Layout from '../layout/Layout.jsx';
import LocationMap from '../common/LocationMap.jsx';
import DroneVideoLoader from '../common/DroneVideoLoader.jsx';
import { primordialDuckService, superPowerService, droneService } from '../../services/api';
import getDuckImage from '../../utils/duckImageSelector';
import assets from '../../assets';
import { HibernationStatus, getHibernationStatusName, getClassificationName, HeightUnit, WeightUnit, GpsPrecisionUnit } from '../../enums/index.js';
import '../../styles/forms.css';
import '../../styles/steps.css';

const PrimordialDuckForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [superPowers, setSuperPowers] = useState([]);
  const [drones, setDrones] = useState([]);
  const [dataLoaded, setDataLoaded] = useState({ superPowers: false, drones: false });
  const [showHeartRate, setShowHeartRate] = useState(false);
  const [showSuperPower, setShowSuperPower] = useState(true);
  const [errors, setErrors] = useState([]);
  const [locationValidation, setLocationValidation] = useState({ isValid: true, message: '' });
  const isEdit = mode === 'edit' || (id && mode !== 'view');
  const isView = mode === 'view';
  const isCreate = !id && mode === 'create';

  const [currentStep, setCurrentStep] = useState(isView ? 5 : 1);
  const [droneLoading, setDroneLoading] = useState(false);
  const [initialDroneId, setInitialDroneId] = useState(null);

  const steps = [
    { number: 1, title: 'Drone', icon: '🚁' },
    { number: 2, title: 'Identificação', icon: '🏷️' },
    { number: 3, title: 'Localização', icon: '📍' },
    { number: 4, title: 'Status', icon: '💤' },
    { number: 5, title: 'Resumo', icon: '📋' }
  ];

  const [formData, setFormData] = useState({
    droneId: '',
    nickname: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'g',
    wingspanCm: '',
    cityName: '',
    country: '',
    locationLatitude: '',
    locationLongitude: '',
    locationPrecision: '',
    precisionUnit: 'm',
    referencePoint: '',
    hibernationStatus: 'Desperto',
    heartRate: '',
    mutationCount: '',
    superPowerId: ''
  });

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([loadSuperPowers(), loadDrones()]);
      if (id) {
        await loadPrimordialDuck();
      }
    };
    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (!isView && currentStep === 5) {
      setCurrentStep(1);
    }
  }, [isView]);

  const loadPrimordialDuck = async () => {
    try {
      setLoadingData(true);
      const duck = await primordialDuckService.getById(id);
      const mappedStatus = getHibernationStatusName(duck.hibernationStatus);

      const mappedFormData = {
        droneId: duck.drone?.id?.toString() || '',
        nickname: duck.nickname || '',
        height: duck.heightValue?.toString() || duck.heightInCentimeters?.toString() || '',
        heightUnit: duck.heightUnit === HeightUnit.CENTIMETERS ? 'cm' : 'ft',
        weight: duck.weightValue?.toString() || duck.weightInGrams?.toString() || '',
        weightUnit: duck.weightUnit === WeightUnit.GRAMS ? 'g' : 'lb',
        wingspanCm: duck.wingspanInCentimeters?.toString() || '',
        cityName: duck.location?.cityName || '',
        country: duck.location?.country || '',
        locationLatitude: duck.location?.latitude?.toString() || '',
        locationLongitude: duck.location?.longitude?.toString() || '',
        locationPrecision: duck.gpsPrecisionValue?.toString() || duck.gpsPrecisionInCentimeters?.toString() || '',
        precisionUnit: duck.gpsPrecisionUnit === GpsPrecisionUnit.CENTIMETERS ? 'cm' : duck.gpsPrecisionUnit === GpsPrecisionUnit.METERS ? 'm' : 'yd',
        referencePoint: duck.location?.referencePoint || '',
        hibernationStatus: mappedStatus,
        heartRate: duck.heartRate?.toString() || '',
        mutationCount: duck.mutationCount?.toString() || '',
        superPowerId: duck.superPower?.id?.toString() || '',
        isCaptured: duck.isCaptured || false
      };

      setFormData(mappedFormData);
      setInitialDroneId(duck.drone?.id?.toString() || '');
    } catch (error) {
      console.error('Erro ao carregar pato primordial:', error);
      setErrors(['Erro ao carregar dados do pato primordial.']);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    const isDormant = formData.hibernationStatus === 'Em Transe' || formData.hibernationStatus === 'Hibernação Profunda';
    const isAwake = formData.hibernationStatus === 'Desperto';

    setShowHeartRate(isDormant);
    setShowSuperPower(isAwake);

    if (!isAwake && formData.superPowerId) {
      setFormData(prev => ({ ...prev, superPowerId: '' }));
    }

    if (isAwake && formData.heartRate) {
      setFormData(prev => ({ ...prev, heartRate: '' }));
    }
  }, [formData.hibernationStatus]);

  useEffect(() => {
    // Apenas no modo de visualização não deve mudar as unidades
    if (isView) return;

    // Se estiver editando, só muda as unidades se o usuário mudar o drone
    if (isEdit && initialDroneId && formData.droneId === initialDroneId) return;

    const selectedDrone = drones.find(d => d.id == formData.droneId);
    if (selectedDrone?.countryOfOrigin === 'EUA') {
      setFormData(prev => ({
        ...prev,
        heightUnit: 'ft',
        weightUnit: 'lb',
        precisionUnit: 'yd'
      }));
    } else if (selectedDrone && selectedDrone.countryOfOrigin !== 'EUA') {
      setFormData(prev => ({
        ...prev,
        heightUnit: 'cm',
        weightUnit: 'g',
        precisionUnit: 'cm'
      }));
    }
  }, [formData.droneId, drones, isView, isEdit, initialDroneId]);

  const loadSuperPowers = async () => {
    if (dataLoaded.superPowers) return;
    try {
      const data = await superPowerService.getAll();
      setSuperPowers(data);
      setDataLoaded(prev => ({ ...prev, superPowers: true }));
    } catch (error) {
      console.error('Erro ao carregar super poderes:', error);
    }
  };

  const loadDrones = async () => {
    if (dataLoaded.drones) return;
    try {
      const data = await droneService.getIdentificationDrones();
      setDrones(data);
      setDataLoaded(prev => ({ ...prev, drones: true }));
    } catch (error) {
      console.error('Erro ao carregar drones:', error);
    }
  };

  const convertUnits = (value, fromUnit, toUnit, type) => {
    if (!value || fromUnit === toUnit) return value;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;

    if (type === 'height') {
      if (fromUnit === 'cm' && toUnit === 'ft') {
        return (numValue / 30.48).toFixed(4);
      }
      if (fromUnit === 'ft' && toUnit === 'cm') {
        return (numValue * 30.48).toFixed(4);
      }
    }

    if (type === 'weight') {
      if (fromUnit === 'g' && toUnit === 'lb') {
        return (numValue / 453.592).toFixed(4);
      }
      if (fromUnit === 'lb' && toUnit === 'g') {
        return (numValue * 453.592).toFixed(4);
      }
    }

    if (type === 'precision') {
      if (fromUnit === 'm' && toUnit === 'yd') {
        return (numValue / 0.9144).toFixed(4);
      }
      if (fromUnit === 'yd' && toUnit === 'm') {
        return (numValue * 0.9144).toFixed(4);
      }
    }

    return value;
  };

  const validateLocation = async () => {
    if (!formData.locationLatitude || !formData.locationLongitude || !formData.cityName || !formData.country) {
      return true;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${formData.locationLatitude}&lon=${formData.locationLongitude}&accept-language=pt-BR`
      );
      const data = await response.json();

      const detectedCity = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || '';
      const detectedCountry = data.address?.country || '';

      const cityMatch = detectedCity.toLowerCase().includes(formData.cityName.toLowerCase()) ||
        formData.cityName.toLowerCase().includes(detectedCity.toLowerCase());
      const countryMatch = detectedCountry.toLowerCase().includes(formData.country.toLowerCase()) ||
        formData.country.toLowerCase().includes(detectedCountry.toLowerCase());

      if (!cityMatch || !countryMatch) {
        setLocationValidation({
          isValid: false,
          message: `As coordenadas apontam para: ${detectedCity}, ${detectedCountry}. Verifique se corresponde à cidade/país informados.`
        });
        return false;
      }

      setLocationValidation({ isValid: true, message: '' });
      return true;
    } catch (error) {
      console.error('Erro na validação:', error);
      return true;
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isView || currentStep !== 5) {
      return;
    }
    setLoading(true);
    setErrors([]);

    const isLocationValid = await validateLocation();
    if (!isLocationValid) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        droneId: parseInt(formData.droneId),
        nickname: formData.nickname || null,
        heightValue: parseFloat(formData.height),
        heightUnit: formData.heightUnit === 'cm' ? 1 : 2,
        weightValue: parseFloat(formData.weight),
        weightUnit: formData.weightUnit === 'g' ? 1 : 2,
        cityName: formData.cityName,
        country: formData.country,
        latitude: parseFloat(formData.locationLatitude),
        longitude: parseFloat(formData.locationLongitude),
        gpsPrecisionValue: parseFloat(formData.locationPrecision),
        gpsPrecisionUnit: formData.precisionUnit === 'cm' ? 1 : formData.precisionUnit === 'm' ? 2 : 3,
        referencePoint: formData.referencePoint || null,
        hibernationStatus: formData.hibernationStatus === 'Desperto' ? HibernationStatus.AWAKE : formData.hibernationStatus === 'Em Transe' ? HibernationStatus.IN_TRANCE : HibernationStatus.DEEP_HIBERNATION,
        heartRate: showHeartRate && formData.heartRate ? parseInt(formData.heartRate) : null,
        mutationCount: parseInt(formData.mutationCount),
        superPowerId: showSuperPower && formData.superPowerId ? parseInt(formData.superPowerId) : null
      };

      if (isEdit) {
        await primordialDuckService.update(id, payload);
      } else {
        await primordialDuckService.create(payload);
      }
      navigate('/primordialducks');
    } catch (error) {
      console.error('Erro ao salvar pato primordial:', error);
      if (error.errors && Array.isArray(error.errors)) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors([error.message]);
      } else {
        setErrors([`Erro ao ${isEdit ? 'atualizar' : 'criar'} pato primordial. Tente novamente.`]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (isView) return;

    let newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };

    if (e.target.name === 'droneId' && e.target.value) {
      setDroneLoading(true);
      setTimeout(() => setDroneLoading(false), 3000);
    }

    if (e.target.name === 'heightUnit' && formData.height) {
      const convertedValue = convertUnits(formData.height, formData.heightUnit, e.target.value, 'height');
      newFormData.height = convertedValue;
    }

    if (e.target.name === 'weightUnit' && formData.weight) {
      const convertedValue = convertUnits(formData.weight, formData.weightUnit, e.target.value, 'weight');
      newFormData.weight = convertedValue;
    }

    if (e.target.name === 'precisionUnit' && formData.locationPrecision) {
      const convertedValue = convertUnits(formData.locationPrecision, formData.precisionUnit, e.target.value, 'precision');
      newFormData.locationPrecision = convertedValue;
    }

    setFormData(newFormData);

    if (e.target.name === 'locationLatitude' || e.target.name === 'locationLongitude') {
      const lat = e.target.name === 'locationLatitude' ? parseFloat(e.target.value) : parseFloat(newFormData.locationLatitude);
      const lng = e.target.name === 'locationLongitude' ? parseFloat(e.target.value) : parseFloat(newFormData.locationLongitude);

      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setTimeout(() => handleLocationChange(lat, lng, '', '', true), 500);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.droneId;
      case 2: {
        if (!formData.height || !formData.weight) return false;
        const height = parseFloat(formData.height);
        const weight = parseFloat(formData.weight);
        const heightValid = formData.heightUnit === 'cm' ? (height >= 80 && height <= 5000) : (height >= 2.62 && height <= 164.04);
        const weightValid = formData.weightUnit === 'g' ? (weight >= 5000 && weight <= 350000) : (weight >= 11.02 && weight <= 771.62);
        return heightValid && weightValid;
      }
      case 3: {
        if (!formData.cityName || !formData.country || !formData.locationLatitude || !formData.locationLongitude || !formData.locationPrecision) return false;
        const precision = parseFloat(formData.locationPrecision);
        if (formData.precisionUnit === 'cm') {
          return precision >= 4 && precision <= 3000;
        } else if (formData.precisionUnit === 'm') {
          return precision >= 0.04 && precision <= 30;
        } else if (formData.precisionUnit === 'yd') {
          return precision >= 0.044 && precision <= 32.8;
        }
        return false;
      }
      case 4: {
        if (!formData.hibernationStatus || !formData.mutationCount) return false;
        const mutations = parseInt(formData.mutationCount);
        if (mutations < 0 || mutations > 10) return false;
        if (showHeartRate) {
          const heartRate = parseInt(formData.heartRate);
          if (!heartRate || heartRate < 1 || heartRate > 300) return false;
        }
        return (!showSuperPower || formData.superPowerId);
      }
      default: return true;
    }
  };

  const handleLocationChange = async (lat, lng, city, country, fromGeocoding = false) => {
    if (isView) return;

    const newData = {
      ...formData,
      locationLatitude: lat.toString(),
      locationLongitude: lng.toString()
    };

    if (city && country && !fromGeocoding) {
      newData.cityName = city;
      newData.country = country;
    }

    const selectedDrone = drones.find(d => d.id == formData.droneId);
    if (selectedDrone?.countryOfOrigin === 'EUA') {
      const precisionYd = (Math.random() * (32.8 - 0.044) + 0.044).toFixed(3);
      newData.locationPrecision = precisionYd;
    } else {
      const precisionCm = (Math.random() * (3000 - 4) + 4).toFixed(0);
      newData.locationPrecision = precisionCm;
      newData.precisionUnit = 'cm';
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&accept-language=pt-BR`
      );
      const data = await response.json();

      const firstPart = data.display_name?.split(',')[0]?.trim();
      if (firstPart && !firstPart.match(/^\d/) && firstPart.length > 2) {
        newData.referencePoint = firstPart;
      }
    } catch (error) {
      console.error('Erro ao buscar ponto de referência:', error);
    }

    setFormData(newData);
  };

  const handleCityCountryChange = async (e) => {
    if (isView) return;

    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);

    if (newFormData.cityName && newFormData.country &&
      (e.target.name === 'cityName' || e.target.name === 'country')) {

      clearTimeout(window.geocodeTimeout);
      window.geocodeTimeout = setTimeout(async () => {
        try {
          const query = `${newFormData.cityName}, ${newFormData.country}`;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=pt-BR`
          );
          const data = await response.json();

          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);

            const selectedDrone = drones.find(d => d.id == formData.droneId);
            let precisionData = {};
            if (selectedDrone?.countryOfOrigin === 'EUA') {
              const precisionYd = (Math.random() * (32.8 - 0.044) + 0.044).toFixed(3);
              precisionData = { locationPrecision: precisionYd };
            } else {
              const precisionCm = (Math.random() * (3000 - 4) + 4).toFixed(0);
              precisionData = { locationPrecision: precisionCm, precisionUnit: 'cm' };
            }

            setFormData(prev => ({
              ...prev,
              locationLatitude: lat.toString(),
              locationLongitude: lng.toString(),
              ...precisionData
            }));
          }
        } catch (error) {
          console.error('Erro na geocodificação:', error);
        }
      }, 1000);
    }
  };

  const handleReferencePointChange = (e) => {
    if (isView) return;
    setFormData(prev => ({ ...prev, referencePoint: e.target.value }));
  };



  const getTitle = () => {
    if (isView) return 'Visualizar Pato Primordial';
    if (isEdit) return 'Editar Pato Primordial';
    return 'Novo Pato Primordial';
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="form-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando dados do pato primordial...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>🛡️ Seleção do Drone</h3>
            <div className="form-group">
              <label>Drone que Coletou os Dados *</label>
              <select name="droneId" value={formData.droneId} onChange={handleChange} required={!isView} disabled={isView}>
                <option value="">Selecione o drone</option>
                {drones.map(drone => (
                  <option key={drone.id} value={drone.id}>
                    {drone.serialNumber} - {drone.brand} ({drone.countryOfOrigin}) - Tipo: {drone.type === 1 || drone.type === 'Identification' ? 'Identificação' : 'Combate'}
                  </option>
                ))}
              </select>
            </div>
            {formData.droneId && !isView && (
              <DroneVideoLoader
                droneId={parseInt(formData.droneId)}
                isVisible={droneLoading}
              />
            )}
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>🏷️ Identificação</h3>
            <div className="form-group">
              <label>Apelido</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname || ''}
                onChange={handleChange}
                placeholder="Ex: Patolino, Quackers, Destruidor"
                maxLength="100"
                disabled={isView}
              />
              <small className="field-hint">Nome carinhoso ou código de identificação (opcional)</small>
            </div>
            <h3>📏 Medidas Físicas</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Altura *</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    step="0.01"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min={formData.heightUnit === 'cm' ? '80' : '2.62'}
                    max={formData.heightUnit === 'cm' ? '5000' : '164.04'}
                    required={!isView}
                    disabled={isView}
                  />
                  <select name="heightUnit" value={formData.heightUnit} onChange={handleChange} disabled={isView || drones.find(d => d.id == formData.droneId)?.countryOfOrigin === 'EUA'}>
                    <option value="cm">cm</option>
                    <option value="ft">pés</option>
                  </select>
                </div>
                <small className={`field-hint ${(() => {
                  const height = parseFloat(formData.height);
                  if (!height) return '';
                  const heightValid = formData.heightUnit === 'cm' ? (height >= 80 && height <= 5000) : (height >= 2.62 && height <= 164.04);
                  return heightValid ? 'field-hint-valid' : 'field-hint-error';
                })()}`}>Entre {formData.heightUnit === 'cm' ? '80cm e 5000cm' : '2.62 e 164.04 pés'}</small>
              </div>
              <div className="form-group">
                <label>Peso *</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    step="0.01"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min={formData.weightUnit === 'g' ? '5000' : '11.02'}
                    max={formData.weightUnit === 'g' ? '350000' : '771.62'}
                    required={!isView}
                    disabled={isView}
                  />
                  <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} disabled={isView || drones.find(d => d.id == formData.droneId)?.countryOfOrigin === 'EUA'}>
                    <option value="g">gramas</option>
                    <option value="lb">libras</option>
                  </select>
                </div>
                <small className={`field-hint ${(() => {
                  const weight = parseFloat(formData.weight);
                  if (!weight) return '';
                  const weightValid = formData.weightUnit === 'g' ? (weight >= 5000 && weight <= 350000) : (weight >= 11.02 && weight <= 771.62);
                  return weightValid ? 'field-hint-valid' : 'field-hint-error';
                })()}`}>Entre {formData.weightUnit === 'g' ? '5000g e 350000g' : '11.02 e 771.62 libras'}</small>
              </div>
              <div className="form-group">
                <label>Envergadura (cm)</label>
                <input type="number" step="0.01" name="wingspanCm" value={formData.wingspanCm} onChange={handleChange} disabled={isView} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>📍 Localização</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Cidade *</label>
                <input type="text" name="cityName" value={formData.cityName} onChange={handleCityCountryChange} required={!isView} disabled={isView} />
              </div>
              <div className="form-group">
                <label>País *</label>
                <input type="text" name="country" value={formData.country} onChange={handleCityCountryChange} required={!isView} disabled={isView} />
              </div>
            </div>
            <div className="form-group">
              <LocationMap
                latitude={parseFloat(formData.locationLatitude) || null}
                longitude={parseFloat(formData.locationLongitude) || null}
                onLocationChange={handleLocationChange}
                disabled={isView}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Latitude *</label>
                <input type="number" step="0.000001" name="locationLatitude" value={formData.locationLatitude} onChange={handleChange} required={!isView} disabled={isView} />
              </div>
              <div className="form-group">
                <label>Longitude *</label>
                <input type="number" step="0.000001" name="locationLongitude" value={formData.locationLongitude} onChange={handleChange} required={!isView} disabled={isView} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Precisão GPS *</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    step="0.01"
                    name="locationPrecision"
                    value={formData.locationPrecision}
                    onChange={handleChange}
                    required={!isView}
                    disabled={isView || !formData.locationLatitude || !formData.locationLongitude}
                  />
                  <select name="precisionUnit" value={formData.precisionUnit} onChange={handleChange} disabled={isView}>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="yd">jardas</option>
                  </select>
                </div>
                <small className={`field-hint ${(() => {
                  const precision = parseFloat(formData.locationPrecision);
                  if (!precision) return '';
                  let precisionValid = false;
                  if (formData.precisionUnit === 'cm') {
                    precisionValid = precision >= 4 && precision <= 3000;
                  } else if (formData.precisionUnit === 'm') {
                    precisionValid = precision >= 0.04 && precision <= 30;
                  } else if (formData.precisionUnit === 'yd') {
                    precisionValid = precision >= 0.044 && precision <= 32.8;
                  }
                  return precisionValid ? 'field-hint-valid' : 'field-hint-error';
                })()}`}>
                  {formData.precisionUnit === 'cm' ? 'Entre 4cm e 3000cm' :
                    formData.precisionUnit === 'm' ? 'Entre 0.04m e 30m' :
                      'Entre 0.044 jardas e 32.8 jardas'}
                </small>
              </div>
              <div className="form-group">
                <label>Ponto de Referência</label>
                <input type="text" name="referencePoint" value={formData.referencePoint} onChange={handleReferencePointChange} disabled={isView} />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>💤 Status e Características</h3>
            <div className="hibernation-status" style={{ marginBottom: '2rem' }}>
              <label>Status de Hibernação *</label>
              <div className="status-options">
                {['Desperto', 'Em Transe', 'Hibernação Profunda'].map(status => (
                  <div key={status} className={`status-card ${formData.hibernationStatus === status ? 'selected' : ''} ${isView ? 'disabled' : ''}`} onClick={() => !isView && setFormData(prev => ({ ...prev, hibernationStatus: status }))}>
                    <div className="status-image">{status === 'Desperto' ? '🐥' : status === 'Em Transe' ? '😴' : '💤'}</div>
                    <span>{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-row">
              {showHeartRate && (
                <div className="form-group">
                  <label>Batimentos Cardíacos (bpm) *</label>
                  <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} required={!isView} min="1" max="300" disabled={isView} />
                  <small className={`field-hint ${(() => {
                    const heartRate = parseInt(formData.heartRate);
                    if (!formData.heartRate || !heartRate) return 'field-hint-error';
                    const heartRateValid = heartRate >= 1 && heartRate <= 300;
                    return heartRateValid ? 'field-hint-valid' : 'field-hint-error';
                  })()}`}>💓 Máximo 300 bpm - mais que isso e é um beija-flor! 🐦</small>
                </div>
              )}
              <div className="form-group">
                <label>Contagem de Mutações *</label>
                <input type="number" name="mutationCount" value={formData.mutationCount} onChange={handleChange} required={!isView} min="0" max="10" disabled={isView} />
                <small className={`field-hint ${(() => {
                  const mutations = parseInt(formData.mutationCount);
                  if (!mutations && mutations !== 0) return '';
                  const mutationsValid = mutations >= 0 && mutations <= 10;
                  return mutationsValid ? 'field-hint-valid' : 'field-hint-error';
                })()}`}>🧬 Máximo 10 mutações - mais que isso e vira um alienígena! 👽</small>
              </div>
            </div>
            {formData.hibernationStatus && formData.mutationCount && (
              <div className="duck-preview">
                <img
                  src={getDuckImage(formData.hibernationStatus, parseInt(formData.mutationCount) || 0)}
                  alt={`Pato ${formData.hibernationStatus}`}
                  onError={(e) => e.target.src = assets.images.patos.patoDesperto1}
                />
                <p>Visualização baseada no status e mutações</p>
              </div>
            )}
            {showSuperPower && (
              <div className="form-group">
                <label>Super Poder Revelado *</label>
                <select name="superPowerId" value={formData.superPowerId} onChange={handleChange} required={!isView} disabled={isView}>
                  <option value="">Selecione o super poder revelado</option>
                  {superPowers.map(power => (
                    <option key={power.id} value={power.id}>
                      {power.name} - {getClassificationName(power.classification)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>{isEdit ? 'Confirmação de Atualização' : 'Confirmação de Catalogação'}</h3>
            <div className="summary-header">
              <div className="duck-preview-large">
                <img
                  src={getDuckImage(formData.hibernationStatus, parseInt(formData.mutationCount) || 0)}
                  alt={`Pato ${formData.hibernationStatus}`}
                  onError={(e) => e.target.src = assets.images.patos.patoDesperto1}
                />
                <div className="specimen-id">{isEdit ? `ESPÉCIME #${id.toString().padStart(3, '0')}` : 'NOVO ESPÉCIME'}</div>
              </div>
              <div className="threat-assessment">
                <h4>🚨 Avaliação de Ameaça</h4>
                <div className={`threat-level ${formData.hibernationStatus === 'Desperto' && formData.superPowerId ? 'critical' : formData.hibernationStatus === 'Desperto' ? 'high' : formData.hibernationStatus === 'Em Transe' ? 'medium' : 'low'}`}>
                  {formData.hibernationStatus === 'Desperto' && formData.superPowerId ? 'CRÍTICO' :
                    formData.hibernationStatus === 'Desperto' ? 'ALTO' :
                      formData.hibernationStatus === 'Em Transe' ? 'MÉDIO' : 'BAIXO'}
                </div>
                <p>Mutações detectadas: <strong>{formData.mutationCount}</strong></p>
                {formData.superPowerId && <p>⚡ Super poder ativo</p>}
              </div>
            </div>

            <div className="summary-grid">
              <div className="summary-card drone-info">
                <h4>🚁 Dados do Drone</h4>
                <div className="info-item">
                  <span>Serial:</span>
                  <span>{drones.find(d => d.id == formData.droneId)?.serialNumber}</span>
                </div>
                <div className="info-item">
                  <span>Marca:</span>
                  <span>{drones.find(d => d.id == formData.droneId)?.brand}</span>
                </div>
                <div className="info-item">
                  <span>Origem:</span>
                  <span>{drones.find(d => d.id == formData.droneId)?.countryOfOrigin}</span>
                </div>
              </div>

              <div className="summary-card measurements">
                <h4>📏 Medidas Físicas</h4>
                <div className="info-item">
                  <span>Altura:</span>
                  <span>{formData.height} {formData.heightUnit === 'cm' ? 'cm' : 'pés'}</span>
                </div>
                <div className="info-item">
                  <span>Peso:</span>
                  <span>{formData.weight} {formData.weightUnit === 'g' ? 'g' : 'lb'}</span>
                </div>
                {formData.wingspanCm && (
                  <div className="info-item">
                    <span>Envergadura:</span>
                    <span>{formData.wingspanCm} cm</span>
                  </div>
                )}
              </div>

              <div className="summary-card location">
                <h4>📍 Localização</h4>
                <div className="info-item">
                  <span>Local:</span>
                  <span>{formData.cityName}, {formData.country}</span>
                </div>
                <div className="info-item">
                  <span>Coordenadas:</span>
                  <span>{parseFloat(formData.locationLatitude).toFixed(6)}°, {parseFloat(formData.locationLongitude).toFixed(6)}°</span>
                </div>
                <div className="info-item">
                  <span>Precisão GPS:</span>
                  <span>{formData.locationPrecision} {formData.precisionUnit === 'cm' ? 'cm' : formData.precisionUnit === 'm' ? 'm' : 'jardas'}</span>
                </div>
                {formData.referencePoint && (
                  <div className="info-item">
                    <span>Referência:</span>
                    <span>{formData.referencePoint}</span>
                  </div>
                )}
              </div>

              <div className="summary-card status">
                <h4>💤 Status Biológico</h4>
                <div className="info-item">
                  <span>Estado:</span>
                  <span className={`status-${formData.hibernationStatus.toLowerCase().replace(' ', '-')}`}>{formData.hibernationStatus}</span>
                </div>
                {formData.heartRate && (
                  <div className="info-item">
                    <span>Batimentos:</span>
                    <span>{formData.heartRate} bpm</span>
                  </div>
                )}
                <div className="info-item">
                  <span>Mutações:</span>
                  <span>{formData.mutationCount}</span>
                </div>
                {formData.superPowerId && (
                  <div className="info-item super-power">
                    <span>Super Poder:</span>
                    <span>⚡ {superPowers.find(p => p.id == formData.superPowerId)?.name}</span>
                  </div>
                )}
                <div className="info-item">
                  <span>Status de Captura:</span>
                  <span className={formData.isCaptured ? 'captured' : 'available'}>
                    {formData.isCaptured ? '🎯 CAPTURADO' : '🆓 DISPONÍVEL'}
                  </span>
                </div>
              </div>
            </div>

            {!isView && (
              <div className="confirmation-warning">
                <h4>⚠️ ATENÇÃO - OPERAÇÃO {isEdit ? 'DE ATUALIZAÇÃO' : 'IRREVERSÍVEL'}</h4>
                <p>{isEdit ? 'Os dados do espécime serão atualizados no banco de dados da operação.' : 'Uma vez catalogado, este espécime será adicionado ao banco de dados da operação.'} Verifique todos os dados antes de confirmar.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="form-page">
        <div className="form-header">
          <button onClick={() => navigate('/primordialducks')} className="back-btn">
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h1>{getTitle()}</h1>
          {isView && !formData.isCaptured && (
            <Link to={`/primordialducks/edit/${id}`} className="btn btn-secondary">
              <Edit size={16} />
              Editar
            </Link>
          )}
          {isView && formData.isCaptured && (
            <div className="captured-notice">
              🎯 PATO CAPTURADO - NÃO EDITÁVEL
            </div>
          )}
        </div>

        {!isView && (
          <div
            className="step-progress"
            data-current-step={currentStep}
            data-total-steps={steps.length}
          >
            {steps.map(step => (
              <div key={step.number} className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}>
                <div className="step-number">{step.icon}</div>
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="entity-form step-form">
          {errors.length > 0 && (
            <div className="error-messages">
              <h4>Erros de validação:</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {!locationValidation.isValid && currentStep === 3 && !isView && (
            <div className="location-warning">
              <h4>⚠️ Atenção - Localização Inconsistente</h4>
              <p>{locationValidation.message}</p>
              <small>Clique no mapa ou ajuste cidade/país para corrigir.</small>
            </div>
          )}

          {renderStepContent()}

          {!isView && (
            <div className="step-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn btn-secondary">
                  Anterior
                </button>
              )}
              {currentStep < 5 ? (
                <button type="button" onClick={nextStep} disabled={!canProceed()} className="btn btn-primary">
                  Próximo
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading} className="btn btn-primary">
                  <Save size={16} />
                  {loading ? 'Salvando...' : isEdit ? 'Confirmar Atualização' : 'Confirmar Catalogação'}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default PrimordialDuckForm;