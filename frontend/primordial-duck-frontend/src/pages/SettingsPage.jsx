import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import authService from '../services/authService';
import Layout from '../components/layout/Layout.jsx';
import { Lock, AlertCircle, CheckCircle, User, Mail, Shield } from 'lucide-react';
import './CrudPages.css';

const SettingsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const getRoleName = (role) => {
        const roles = {
            '0': 'Administrador',
            '1': 'Operador',
            '2': 'Visualizador'
        };
        return roles[role] || 'Usuário';
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            if (formData.newPassword !== formData.confirmPassword) {
                setError('As senhas não coincidem');
                setLoading(false);
                return;
            }

            if (formData.newPassword.length < 6) {
                setError('A nova senha deve ter pelo menos 6 caracteres');
                setLoading(false);
                return;
            }

            if (formData.currentPassword === formData.newPassword) {
                setError('A nova senha deve ser diferente da senha atual');
                setLoading(false);
                return;
            }

            await authService.changePassword(
                formData.currentPassword,
                formData.newPassword,
                formData.confirmPassword
            );

            setSuccess(true);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Erro ao alterar senha:', err);
            setError(err.response?.data?.message || 'Erro ao alterar senha. Verifique sua senha atual.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="crud-page">
                <div className="page-header">
                    <div className="header-content">
                        <h1>Configurações</h1>
                        <p>Gerencie suas informações e segurança</p>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Card de Informações do Usuário */}
                    <div className="card">
                        <div className="card-header">
                            <h2>
                                <User size={20} />
                                Informações da Conta
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-icon">
                                        <User size={18} />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Nome</span>
                                        <span className="info-value">{user?.name || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon">
                                        <Mail size={18} />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{user?.email || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card de Alteração de Senha */}
                    <div className="card">
                        <div className="card-header">
                            <h2>
                                <Lock size={20} />
                                Alterar Senha
                            </h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="form-container">
                                {error && (
                                    <div className="alert alert-error">
                                        <AlertCircle size={18} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success">
                                        <CheckCircle size={18} />
                                        <span>Senha alterada com sucesso! Redirecionando...</span>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label htmlFor="currentPassword">Senha Atual</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="Digite sua senha atual"
                                        required
                                        disabled={loading || success}
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">Nova Senha</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Digite sua nova senha (mín. 6 caracteres)"
                                        required
                                        minLength={6}
                                        disabled={loading || success}
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirme sua nova senha"
                                        required
                                        minLength={6}
                                        disabled={loading || success}
                                        className="form-control"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading || success}
                                >
                                    {loading ? 'Alterando...' : success ? 'Senha Alterada ✓' : 'Alterar Senha'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .content-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }

                .info-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    border: 1px solid rgba(212, 97, 10, 0.2);
                    transition: all 0.3s ease;
                }

                .info-item:hover {
                    border-color: rgba(212, 97, 10, 0.4);
                    background: rgba(0, 0, 0, 0.3);
                }

                .info-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: rgba(212, 97, 10, 0.1);
                    border-radius: 8px;
                    color: #d4610a;
                    flex-shrink: 0;
                }

                .info-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    flex: 1;
                }

                .info-label {
                    font-size: 0.85rem;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                }

                .info-value {
                    font-size: 1rem;
                    color: #fff;
                    font-weight: 500;
                }

                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                }

                .alert {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .alert-error {
                    background-color: rgba(220, 38, 38, 0.1);
                    border: 1px solid rgba(220, 38, 38, 0.3);
                    color: #ff6b6b;
                }

                .alert-success {
                    background-color: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    color: #4ade80;
                }

                @media (max-width: 768px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default SettingsPage;
