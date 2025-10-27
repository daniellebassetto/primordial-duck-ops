import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Edit, Battery, Fuel, Wrench } from 'lucide-react';
import Layout from '../layout/Layout.jsx';
import { droneService } from '../../services/api';
import '../../styles/forms.css';

const DroneForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    serialNumber: '',
    brand: '',
    manufacturer: '',
    countryOfOrigin: '',
    type: 1,
    batteryLevel: 100,
    fuelLevel: 100,
    integrity: 100
  });

  const isEdit = mode === 'edit' || (id && mode !== 'view');
  const isView = mode === 'view';
  const isCreate = !id && mode === 'create';

  useEffect(() => {
    if (id) {
      loadDrone();
    }
  }, [id]);

  const loadDrone = async () => {
    try {
      setLoadingData(true);
      const drone = await droneService.getById(id);
      setFormData({
        serialNumber: drone.serialNumber || '',
        brand: drone.brand || '',
        manufacturer: drone.manufacturer || '',
        countryOfOrigin: drone.countryOfOrigin || '',
        type: drone.type || 1,
        batteryLevel: drone.batteryLevel || 100,
        fuelLevel: drone.fuelLevel || 100,
        integrity: drone.integrity || 100
      });
    } catch (error) {
      console.error('Erro ao carregar drone:', error);
      setErrors(['Erro ao carregar dados do drone.']);
    } finally {
      setLoadingData(false);
    }
  };

  const countries = [
    'Afeganistão', 'África do Sul', 'Albânia', 'Alemanha', 'Andorra', 'Angola', 'Antígua e Barbuda', 'Arábia Saudita', 'Argélia', 'Argentina', 'Armênia', 'Austrália', 'Áustria', 'Azerbaijão',
    'Bahamas', 'Bahrein', 'Bangladesh', 'Barbados', 'Bélgica', 'Belize', 'Benin', 'Bielorrússia', 'Bolívia', 'Bósnia e Herzegovina', 'Botsuana', 'Brasil', 'Brunei', 'Bulgária', 'Burkina Faso', 'Burundi',
    'Butão', 'Cabo Verde', 'Camarões', 'Camboja', 'Canadá', 'Catar', 'Cazaquistão', 'Chade', 'Chile', 'China', 'Chipre', 'Colômbia', 'Comores', 'Congo', 'Coreia do Norte', 'Coreia do Sul', 'Costa do Marfim', 'Costa Rica', 'Croácia', 'Cuba',
    'Dinamarca', 'Djibuti', 'Dominica', 'EUA', 'Egito', 'El Salvador', 'Emirados Árabes Unidos', 'Equador', 'Eritreia', 'Eslováquia', 'Eslovênia', 'Espanha', 'Estônia', 'Eswatini', 'Etiópia',
    'Fiji', 'Filipinas', 'Finlândia', 'França', 'Gabão', 'Gâmbia', 'Gana', 'Geórgia', 'Granada', 'Grécia', 'Guatemala', 'Guiana', 'Guiné', 'Guiné-Bissau', 'Guiné Equatorial',
    'Haiti', 'Honduras', 'Hungria', 'Iêmen', 'Ilhas Marshall', 'Índia', 'Indonésia', 'Irã', 'Iraque', 'Irlanda', 'Islândia', 'Israel', 'Itália', 'Jamaica', 'Japão', 'Jordânia',
    'Kuwait', 'Laos', 'Lesoto', 'Letônia', 'Líbano', 'Libéria', 'Líbia', 'Liechtenstein', 'Lituânia', 'Luxemburgo', 'Macedônia do Norte', 'Madagascar', 'Malásia', 'Malawi', 'Maldivas', 'Mali', 'Malta', 'Marrocos', 'Maurício', 'Mauritânia', 'México', 'Mianmar', 'Micronésia', 'Moçambique', 'Moldávia', 'Mônaco', 'Mongólia', 'Montenegro',
    'Namíbia', 'Nauru', 'Nepal', 'Nicarágua', 'Níger', 'Nigéria', 'Noruega', 'Nova Zelândia', 'Omã', 'Países Baixos', 'Palau', 'Panamá', 'Papua-Nova Guiné', 'Paquistão', 'Paraguai', 'Peru', 'Polônia', 'Portugal',
    'Quênia', 'Quirguistão', 'Reino Unido', 'República Centro-Africana', 'República Checa', 'República Democrática do Congo', 'República Dominicana', 'Romênia', 'Ruanda', 'Rússia',
    'Samoa', 'San Marino', 'Santa Lúcia', 'São Cristóvão e Nevis', 'São Tomé e Príncipe', 'São Vicente e Granadinas', 'Seicheles', 'Senegal', 'Serra Leoa', 'Sérvia', 'Singapura', 'Síria', 'Somália', 'Sri Lanka', 'Suazilândia', 'Sudão', 'Sudão do Sul', 'Suécia', 'Suíça', 'Suriname',
    'Tailândia', 'Taiwan', 'Tajiquistão', 'Tanzânia', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad e Tobago', 'Tunísia', 'Turcomenistão', 'Turquia', 'Tuvalu', 'Ucrânia', 'Uganda', 'Uruguai', 'Uzbequistão', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnã', 'Zâmbia', 'Zimbábue'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return;

    setLoading(true);
    setErrors([]);

    try {
      let payload = { ...formData };

      if (formData.type == 1) {
        delete payload.batteryLevel;
        delete payload.fuelLevel;
        delete payload.integrity;
      }

      if (isEdit) {
        await droneService.update(id, payload);
        if (formData.type == 2) {
          await droneService.updateStatus(id, {
            batteryLevel: formData.batteryLevel,
            fuelLevel: formData.fuelLevel,
            integrity: formData.integrity
          });
        }
      } else {
        await droneService.create(payload);
      }
      navigate('/drones');
    } catch (error) {
      console.error('Erro ao salvar drone:', error);
      if (error.errors && Array.isArray(error.errors)) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors([error.message]);
      } else {
        setErrors([`Erro ao ${isEdit ? 'atualizar' : 'criar'} drone. Tente novamente.`]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (isView) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getTitle = () => {
    if (isView) return 'Visualizar Drone';
    if (isEdit) return 'Editar Drone';
    return 'Novo Drone';
  };

  const getStatusColor = (level) => {
    if (level >= 70) return '#4CAF50';
    if (level >= 30) return '#FFA500';
    return '#ff4444';
  };

  const handleRechargeBattery = async () => {
    try {
      await droneService.rechargeBattery(id);
      loadDrone();
    } catch (error) {
      console.error('Erro ao recarregar bateria:', error);
    }
  };

  const handleRefuel = async () => {
    try {
      await droneService.refuel(id);
      loadDrone();
    } catch (error) {
      console.error('Erro ao reabastecer:', error);
    }
  };

  const handleMaintenance = async () => {
    try {
      await droneService.performMaintenance(id);
      loadDrone();
    } catch (error) {
      console.error('Erro ao realizar manutenção:', error);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="form-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando dados do drone...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="form-page">
        <div className="form-header">
          <button onClick={() => navigate('/drones')} className="back-btn">
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h1>{getTitle()}</h1>
          {isView && (
            <Link to={`/drones/edit/${id}`} className="btn btn-secondary">
              <Edit size={16} />
              Editar
            </Link>
          )}
        </div>

        <form onSubmit={handleSubmit} className="entity-form">
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
          <div className="form-group">
            <label>Número de Série *</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Ex: DRN-2024-001, SN123456789"
              required={!isView}
              disabled={isView}
            />
          </div>

          <div className="form-group">
            <label>Marca *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Ex: DJI, Parrot, Autel"
              required={!isView}
              disabled={isView}
            />
          </div>

          <div className="form-group">
            <label>Fabricante *</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Ex: DJI Technology Co., Parrot SA"
              required={!isView}
              disabled={isView}
            />
          </div>

          <div className="form-group">
            <label>País de Origem *</label>
            <select
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              required={!isView}
              disabled={isView}
            >
              <option value="">Selecione o país</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo *</label>
            {isView ? (
              <input
                type="text"
                value={formData.type == 1 || formData.type === 'Identification' ? 'Identificação' : 'Combate'}
                disabled
                readOnly
              />
            ) : isEdit ? (
              <input
                type="text"
                value={formData.type == 1 || formData.type === 'Identification' ? 'Identificação' : 'Combate'}
                disabled
                readOnly
              />
            ) : (
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required={!isView}
              >
                <option value={1}>Identificação</option>
                <option value={2}>Combate</option>
              </select>
            )}
            {isEdit && (
              <small className="form-help">O tipo do drone não pode ser alterado após a criação</small>
            )}
          </div>

          {(formData.type == 2 || formData.type === 'Combat') && isCreate && (
            <>
              <div className="form-group">
                <label>Nível de Bateria (%)</label>
                <input
                  type="number"
                  name="batteryLevel"
                  value={formData.batteryLevel || 100}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
                <small className="form-help">(0-100%)</small>
              </div>
              <div className="form-group">
                <label>Nível de Combustível (%)</label>
                <input
                  type="number"
                  name="fuelLevel"
                  value={formData.fuelLevel || 100}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
                <small className="form-help">(0-100%)</small>
              </div>
              <div className="form-group">
                <label>Integridade (%)</label>
                <input
                  type="number"
                  name="integrity"
                  value={formData.integrity || 100}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
                <small className="form-help">(0-100%)</small>
              </div>
            </>
          )}

          {(formData.type == 2 || formData.type === 'Combat') && (isView || isEdit) && (
            <div className="drone-status-view">
              <h3>Status Operacional</h3>
              <div className="status-grid">
                <div className="status-item-large">
                  <div className="status-header">
                    <Battery size={20} />
                    <span>Bateria: {formData.batteryLevel || 0}%</span>
                  </div>
                  <div className="status-bar-large">
                    <div
                      className="status-fill"
                      style={{
                        width: `${formData.batteryLevel || 0}%`,
                        backgroundColor: getStatusColor(formData.batteryLevel || 0)
                      }}
                    ></div>
                  </div>
                </div>
                <div className="status-item-large">
                  <div className="status-header">
                    <Fuel size={20} />
                    <span>Combustível: {formData.fuelLevel || 0}%</span>
                  </div>
                  <div className="status-bar-large">
                    <div
                      className="status-fill"
                      style={{
                        width: `${formData.fuelLevel || 0}%`,
                        backgroundColor: getStatusColor(formData.fuelLevel || 0)
                      }}
                    ></div>
                  </div>
                </div>
                <div className="status-item-large">
                  <div className="status-header">
                    <Wrench size={20} />
                    <span>Integridade: {formData.integrity || 0}%</span>
                  </div>
                  <div className="status-bar-large">
                    <div
                      className="status-fill"
                      style={{
                        width: `${formData.integrity || 0}%`,
                        backgroundColor: getStatusColor(formData.integrity || 0)
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="maintenance-actions-large">
                <button
                  onClick={handleRechargeBattery}
                  className="maintenance-btn-large battery"
                  disabled={formData.batteryLevel >= 100}
                >
                  <Battery size={16} />
                  {formData.batteryLevel >= 100 ? 'Bateria Cheia' : 'Recarregar Bateria'}
                </button>
                <button
                  onClick={handleRefuel}
                  className="maintenance-btn-large fuel"
                  disabled={formData.fuelLevel >= 100}
                >
                  <Fuel size={16} />
                  {formData.fuelLevel >= 100 ? 'Tanque Cheio' : 'Reabastecer'}
                </button>
                <button
                  onClick={handleMaintenance}
                  className="maintenance-btn-large maintenance"
                  disabled={formData.batteryLevel >= 100 && formData.fuelLevel >= 100 && formData.integrity >= 100}
                >
                  <Wrench size={16} />
                  {(formData.batteryLevel >= 100 && formData.fuelLevel >= 100 && formData.integrity >= 100) ? 'Tudo OK' : 'Manutenção Completa'}
                </button>
              </div>
            </div>
          )}

          {!isView && (
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar Drone' : 'Salvar Drone'}
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default DroneForm;