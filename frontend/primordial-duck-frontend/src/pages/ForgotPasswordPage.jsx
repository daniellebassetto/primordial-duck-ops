import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import emailService from '../services/emailService';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import './AuthPages.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);

            if (response.data && response.data.temporaryPassword) {
                try {
                    await emailService.sendPasswordResetEmail(email, response.data.temporaryPassword);
                    setSuccess(true);
                } catch (emailError) {
                    console.error('Erro ao enviar e-mail:', emailError);
                    setError('Senha temporária gerada, mas houve um erro ao enviar o e-mail. Verifique as configurações do EmailJS.');
                }
            } else {
                setSuccess(true);
            }
        } catch (err) {
            console.error('Erro ao solicitar redefinição:', err);
            setError(err.response?.data?.message || 'Erro ao processar solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page forgot-password-page">
            <div className="auth-logo">
                <img src="/src/assets/images/logo.png" alt="Primordial Duck Operation" />
            </div>
            <div className="auth-container">
                <div className="auth-header">
                    <h1>RECUPERAÇÃO DE ACESSO</h1>
                    <p>Digite seu e-mail para receber as instruções</p>
                </div>

                {success ? (
                    <div className="success-message">
                        <CheckCircle size={48} />
                        <h3>Senha Temporária Enviada!</h3>
                        <p>
                            Se o e-mail informado estiver cadastrado, você receberá uma senha temporária
                            para acessar o sistema em alguns instantes.
                        </p>
                        <p className="small-text">
                            Verifique sua caixa de entrada e também a pasta de spam.
                        </p>
                        <p className="small-text">
                            <strong>Importante:</strong> Use a senha temporária para fazer login e depois altere-a no sistema.
                        </p>
                        <Link to="/login" className="btn btn-primary btn-full">
                            <ArrowLeft size={16} />
                            Voltar ao Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={16} />
                                Email de Operador
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operador@primordial.ops"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'PROCESSANDO...' : 'ENVIAR INSTRUÇÕES'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <p>Lembrou sua senha?</p>
                    <Link to="/login" className="auth-link">
                        <ArrowLeft size={14} />
                        Voltar ao Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
