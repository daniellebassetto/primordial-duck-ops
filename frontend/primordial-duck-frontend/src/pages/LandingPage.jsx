import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Target, Users, AlertTriangle, Clock, Key } from 'lucide-react';
import assets from '../assets';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              PRIMORDIAL DUCK
              <span className="highlight">OPERATION</span>
            </h1>
            <p className="hero-subtitle">
              O FUTURO ESTÁ EM RISCO
            </p>
            <p className="hero-description">
              Após derrotar os Xenófagos em 2024 e destruir a nave-mãe alienígena, a humanidade acreditava que finalmente poderia respirar em paz. Mas, enquanto celebrávamos a vitória, um segredo adormecido começou a despertar...
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">
                ACESSAR CHRONODRIVE
              </Link>
              <Link to="/register" className="btn btn-secondary">
                ALISTAR-SE NA MISSÃO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Threat Section */}
      <section className="threat-section">
        <div className="container">
          <h2 className="section-title">A AMEAÇA REVELADA</h2>
          <div className="threat-content">
            <p>
              Fragmentos de dados encontrados nos destroços revelaram uma verdade perturbadora: o passado da Terra foi manipulado. Há milhões de anos, os Xenófagos alteraram a evolução natural do planeta, criando uma espécie secreta e altamente inteligente: <strong>os Patos Primordiais</strong>.
            </p>
            <p>
              Eles estiveram em hibernação por eras, mas a explosão da nave-mãe ativou um protocolo antigo. Agora, organizados e armados com conhecimento avançado, eles planejam retomar o planeta... e nós temos pouco tempo.
            </p>
            <div className="threat-warning">
              Decifre o passado. Salve o futuro.
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Video Section */}
      <section className="recruitment-section">
        <div className="container">
          <h2 className="section-title">CHAMADA PARA ALISTAMENTO</h2>
          <div className="video-container">
            <video
              controls
              autoPlay
              muted
              loop
              className="recruitment-video"
            >
              <source src={assets.videos.videoAlistamento} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-overlay"></div>
        <div className="container">
          <div className="mission-content">
            <h2 className="section-title">SUA MISSÃO ⏱️</h2>
            <p className="mission-text">
              Análises conduzidas por diferentes centros de pesquisa ao redor do mundo — incluindo dados fornecidos por equipes da DSIN — revelaram uma descoberta surpreendente: um artefato alienígena chamado <strong>ChronoDrive</strong>, capaz de abrir portais para o passado.
            </p>
            <p className="mission-text">
              Você foi escolhido para liderar a operação. Sua missão: viajar no tempo, identificar o momento exato da manipulação genética e impedir que os Patos Primordiais alterem o curso da história.
            </p>
            <div className="mission-warning">
              ⚠️ <strong>ATENÇÃO:</strong> Mexer no passado pode reescrever o futuro. Cada decisão será definitiva e cada cálculo poderá mudar o destino da humanidade.
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">CAPACIDADES OPERACIONAIS</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Shield className="feature-icon" />
              <h3>Catalogação Avançada</h3>
              <p>Sistema completo de registro e análise de Patos Primordiais com dados biométricos e comportamentais.</p>
            </div>
            <div className="feature-card">
              <Target className="feature-icon" />
              <h3>Análise Tática</h3>
              <p>Avaliação de riscos e custos operacionais para missões de captura e contenção.</p>
            </div>
            <div className="feature-card">
              <Zap className="feature-icon" />
              <h3>Controle de Drones</h3>
              <p>Gerenciamento de frota de drones especializados para operações de campo.</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Coordenação Global</h3>
              <p>Rede mundial de operadores trabalhando juntos pela sobrevivência da humanidade.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">LINHA DO TEMPO DA AMEAÇA</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker">2024</div>
              <div className="timeline-content">
                <h3>Vitória Contra os Xenófagos</h3>
                <p>Destruição da nave-mãe alienígena. A humanidade celebra a vitória.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">2025</div>
              <div className="timeline-content">
                <h3>Descoberta dos Fragmentos</h3>
                <p>Dados revelam a manipulação genética do passado e a existência dos Patos Primordiais.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">AGORA</div>
              <div className="timeline-content">
                <h3>Ativação do Protocolo</h3>
                <p>Os Patos Primordiais despertam. O ChronoDrive é descoberto. Sua missão começa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className="cta-logo">
            <img src={assets.images.logo} alt="Primordial Duck Operation" />
          </div>
          <h2 className="cta-title">CHRONODRIVE ATIVADO</h2>
          <div className="cta-content">
            <p className="cta-text">
              O portal temporal está aberto. Sua missão aguarda.
            </p>
            <div className="cta-warning">
              <AlertTriangle size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> ACESSO RESTRITO - APENAS OPERADORES AUTORIZADOS
            </div>
            <p className="cta-final">
              Boa sorte, viajante do tempo. O destino da humanidade está em suas mãos.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-cta">
              <Clock size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> INICIAR VIAGEM TEMPORAL
            </Link>
            <Link to="/login" className="btn btn-secondary-cta">
              <Key size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> JÁ TENHO ACESSO
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;