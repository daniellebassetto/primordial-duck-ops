import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Edit } from 'lucide-react';
import Layout from '../layout/Layout.jsx';
import { superPowerService } from '../../services/api';
import { SuperPowerClassification, getClassificationName } from '../../enums/index.js';
import '../../styles/forms.css';

const SuperPowerForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    classification: 0
  });

  const isEdit = mode === 'edit' || (id && mode !== 'view');
  const isView = mode === 'view';
  const isCreate = !id && mode === 'create';

  useEffect(() => {
    if (id) {
      loadSuperPower();
    }
  }, [id]);

  const loadSuperPower = async () => {
    try {
      setLoadingData(true);
      const power = await superPowerService.getById(id);
      setFormData({
        name: power.name || '',
        description: power.description || '',
        classification: power.classification || 0
      });
    } catch (error) {
      console.error('Erro ao carregar super poder:', error);
      setErrors(['Erro ao carregar dados do super poder.']);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return;
    
    setLoading(true);
    setErrors([]);
    
    try {
      if (isEdit) {
        await superPowerService.update(id, formData);
      } else {
        await superPowerService.create(formData);
      }
      navigate('/superpowers');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([`Erro ao ${isEdit ? 'atualizar' : 'criar'} super poder. Tente novamente.`]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (isView) return;
    const value = e.target.name === 'classification' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const getTitle = () => {
    if (isView) return 'Visualizar Super Poder';
    if (isEdit) return 'Editar Super Poder';
    return 'Novo Super Poder';
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="form-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando dados do super poder...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="form-page">
        <div className="form-header">
          <button onClick={() => navigate('/superpowers')} className="back-btn">
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h1>{getTitle()}</h1>
          {isView && (
            <Link to={`/superpowers/edit/${id}`} className="btn btn-secondary">
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
            <label>Nome *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Telecinese, Invisibilidade, Controle do Tempo"
              required={!isView}
              disabled={isView}
            />
          </div>

          <div className="form-group">
            <label>Descrição *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Descreva detalhadamente o super poder, suas capacidades e limitações..."
              required={!isView}
              disabled={isView}
            />
          </div>

          <div className="form-group">
            <label>Classificação *</label>
            {isView ? (
              <input 
                type="text" 
                value={getClassificationName(formData.classification)} 
                disabled 
                readOnly 
              />
            ) : (
              <select
                name="classification"
                value={formData.classification}
                onChange={handleChange}
                required={!isView}
              >
                <option value={SuperPowerClassification.WARLIKE}>Bélico</option>
                <option value={SuperPowerClassification.DEFENSIVE}>Defensivo</option>
                <option value={SuperPowerClassification.ELEMENTAL}>Elemental</option>
                <option value={SuperPowerClassification.PSYCHIC}>Psíquico</option>
                <option value={SuperPowerClassification.TECHNOLOGICAL}>Tecnológico</option>
                <option value={SuperPowerClassification.BIOLOGICAL}>Biológico</option>
                <option value={SuperPowerClassification.TEMPORAL}>Temporal</option>
                <option value={SuperPowerClassification.DIMENSIONAL}>Dimensional</option>
              </select>
            )}
          </div>

          {!isView && (
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar Super Poder' : 'Salvar Super Poder'}
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default SuperPowerForm;