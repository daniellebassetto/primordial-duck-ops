import React from 'react';
import {
  Target, DollarSign, Shield, Beaker, TrendingUp, Calculator, Brain, AlertTriangle,
  Moon, Zap, Eye, Clock, Search, HelpCircle, X, Swords, Flame, Cpu, Dna, MapPin,
  Plane, Crosshair, Hexagon, Theater, Ghost, Waves, ShieldAlert, EyeOff,
  Bolt, MoveRight, Bomb, Sparkles, Volume2, Network, Tornado
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import './CaptureLogicPage.css';

const CaptureLogicPage = () => {
  return (
    <Layout>
      <div className="capture-logic-page">
        <div className="page-header">
          <div className="header-content">
            <Brain size={32} className="header-icon" />
            <div>
              <h1>Lógica da Operação Visão de Captura</h1>
              <p>Entenda como funciona o sistema de análise estratégica para captura de Patos Primordiais</p>
            </div>
          </div>
        </div>

        <div className="logic-container">
          <div className="intro-section">
            <div className="intro-card">
              <Calculator size={48} className="intro-icon" />
              <h2>Sistema de Análise Estratégica</h2>
              <p>
                O sistema avalia cada Pato Primordial através de 4 métricas principais,
                calculando uma pontuação geral que determina a viabilidade da operação de captura.
              </p>
            </div>
          </div>

          <div className="metrics-explanation">
            <h2>Métricas de Avaliação</h2>

            <div className="metric-explanation cost">
              <div className="metric-header">
                <DollarSign size={32} />
                <h3>Custo Operacional (0-100%)</h3>
              </div>
              <div className="metric-content">
                <p><strong>O que mede:</strong> Recursos necessários para transporte, contenção e equipamentos especializados.</p>
                <div className="factors">
                  <h4>Fatores que aumentam o custo:</h4>
                  <ul>
                    <li><strong>Tamanho:</strong> &gt;3000cm = +45, &gt;1500cm = +35, &gt;800cm = +25, &gt;300cm = +15</li>
                    <li><strong>Peso:</strong> &gt;250kg = +40, &gt;150kg = +30, &gt;80kg = +20, &gt;30kg = +15</li>
                    <li><strong>Distância da Base:</strong> &gt;5000km = +35, &gt;2000km = +25, &gt;1000km = +18, &gt;500km = +12</li>
                    <li><strong>Precisão GPS:</strong> &gt;2000cm = +20, &gt;1000cm = +15, &gt;500cm = +12, &gt;100cm = +8</li>
                    <li><strong>Mutações:</strong> ≥10 = x3 cada, ≥5 = x2 cada, ≥1 = x1 cada</li>
                    <li><strong>Super Poderes:</strong> Temporal +25, Dimensional +22, Psíquico +18, Tecnológico +15, Bélico +12</li>
                    <li><strong>Estado:</strong> Desperto +30, Em Transe +15, Hibernação Profunda +5</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="metric-explanation military">
              <div className="metric-header">
                <Target size={32} />
                <h3>Poder Militar (0-100%)</h3>
              </div>
              <div className="metric-content">
                <p><strong>O que mede:</strong> Força de combate necessária para neutralizar o espécime.</p>
                <div className="factors">
                  <h4>Fatores que aumentam o poder:</h4>
                  <ul>
                    <li><strong>Tamanho físico:</strong> &gt;2000cm + &gt;200kg = +30, &gt;1000cm + &gt;100kg = +25, &gt;500cm + &gt;50kg = +20</li>
                    <li><strong>Estado hibernação:</strong> Desperto x3.0, Transe variável (batimentos), Hibernação x0.3</li>
                    <li><strong>Super poderes (desperto):</strong> Bélico +35, Dimensional +30, Temporal +28, Psíquico +25</li>
                    <li><strong>Super poderes (transe):</strong> Reduzidos a 70% do valor base</li>
                    <li><strong>Super poderes (hibernação):</strong> Reduzidos a 20% do valor base</li>
                    <li><strong>Mutações:</strong> ≥8 = x5 cada, ≥5 = x4 cada, ≥3 = x3 cada, ≥1 = x2 cada</li>
                    <li><strong>Batimentos (em transe):</strong> &gt;150 bpm = x2.2, &gt;100 bpm = x1.8, &gt;60 bpm = x1.4</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="metric-explanation risk">
              <div className="metric-header">
                <Shield size={32} />
                <h3>Nível de Risco (0-100%)</h3>
              </div>
              <div className="metric-content">
                <p><strong>O que mede:</strong> Probabilidade de falha da missão ou perda de recursos.</p>
                <div className="factors">
                  <h4>Fatores que aumentam o risco:</h4>
                  <ul>
                    <li><strong>Estado desperto:</strong> +45 pontos base (altamente perigoso)</li>
                    <li><strong>Estado em transe:</strong> Variável por batimentos - &gt;200 bpm = +35, &gt;150 bpm = +30, &gt;100 bpm = +25</li>
                    <li><strong>Super poderes (desperto):</strong> Bélico +25, Temporal +22, Dimensional +20, Psíquico +18</li>
                    <li><strong>Super poderes (transe):</strong> Reduzidos a 60% do valor</li>
                    <li><strong>Super poderes (hibernação):</strong> Reduzidos a 30% do valor</li>
                    <li><strong>Mutações:</strong> 10 = +30, ≥8 = +25, ≥6 = +20, ≥4 = +15, ≥3 = +10</li>
                    <li><strong>Tamanho:</strong> &gt;3000cm = +18, &gt;1500cm = +15, &gt;800cm = +12, &gt;400cm = +8</li>
                    <li><strong>Distância da Base:</strong> &gt;3000km = +10, &gt;1500km = +6, &gt;500km = +3</li>
                    <li><strong>Precisão GPS:</strong> &gt;2000cm = +10, &gt;1000cm = +7, &gt;500cm = +5, &gt;200cm = +3</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="metric-explanation scientific">
              <div className="metric-header">
                <Beaker size={32} />
                <h3>Valor Científico (0-100%)</h3>
              </div>
              <div className="metric-content">
                <p><strong>O que mede:</strong> Potencial de descobertas científicas e avanços tecnológicos.</p>
                <div className="factors">
                  <h4>Fatores que aumentam o valor:</h4>
                  <ul>
                    <li><strong>Mutações:</strong> 10 = +45, ≥8 = +40, ≥6 = +35, ≥5 = +30, ≥4 = +25, ≥3 = +20, ≥2 = +15, 1 = +8</li>
                    <li><strong>Super poderes:</strong> Temporal +30, Dimensional +28, Psíquico +20, Tecnológico +18, Biológico +15</li>
                    <li><strong>Hibernação profunda:</strong> +20 pontos base (estado ideal para estudo)</li>
                    <li><strong>Em transe:</strong> Variável por batimentos - quanto mais lento, mais valioso</li>
                    <li><strong>Dimensões extremas:</strong> &gt;4000cm ou &lt;100cm = +15 (anomalia científica)</li>
                    <li><strong>Peso extremo:</strong> &gt;300kg ou &lt;8kg = +12 (estrutura anômala)</li>
                    <li><strong>Precisão GPS alta:</strong> ≤10cm = +10, ≤25cm = +8, ≤50cm = +6 (localização exata)</li>
                    <li><strong>Combinações raras:</strong> 10+ mutações + poder especial = bônus adicional</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="calculation-section">
            <div className="calculation-card">
              <TrendingUp size={48} className="calc-icon" />
              <h2>Cálculo da Pontuação Geral</h2>
              <div className="formula">
                <div className="formula-step">
                  <h4>1. Pontuação Base</h4>
                  <code>Base = Valor Científico × 1.8</code>
                </div>
                <div className="formula-step">
                  <h4>2. Bônus de Capturabilidade (Status)</h4>
                  <code>Hibernação Profunda: +40 (Muito fácil) <Moon size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></code>
                  <code>Em Transe: +25 (Moderado) <Zap size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></code>
                  <code>Desperto: -30 (PENALIDADE - Perigoso!) <Eye size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></code>
                </div>
                <div className="formula-step">
                  <h4>3. Penalidades</h4>
                  <code>Penalidade Custo = Custo &gt; 80% ? × 0.5 : × 0.3</code>
                  <code>Penalidade Risco = Risco &gt; 70% ? × 0.8 : × 0.5</code>
                  <code>Penalidade Militar = Poder Militar × 0.4</code>
                </div>
                <div className="formula-step">
                  <h4>4. Resultado Final</h4>
                  <code>Score = Base + Bônus Status - Risco - Militar - (Custo ÷ 2)</code>
                  <p className="formula-note"><AlertTriangle size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Score BAIXO = NÃO recomendado | Score ALTO = Recomendado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="classification-section">
            <h2>Classificações de Prioridade</h2>
            <div className="classifications">
              <div className="classification-item priority-max">
                <div className="score-range">85-100</div>
                <div className="classification-info">
                  <h4>PRIORIDADE MÁXIMA</h4>
                  <p><Target size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Captura imediata recomendada - Alto valor científico com risco aceitável</p>
                </div>
              </div>
              <div className="classification-item priority-high">
                <div className="score-range">70-84</div>
                <div className="classification-info">
                  <h4>PRIORIDADE ALTA</h4>
                  <p><AlertTriangle size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Captura planejada - Preparar recursos adequados antes da operação</p>
                </div>
              </div>
              <div className="classification-item priority-moderate">
                <div className="score-range">50-69</div>
                <div className="classification-info">
                  <h4>PRIORIDADE MODERADA</h4>
                  <p><Search size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Monitoramento - Aguardar condições mais favoráveis</p>
                </div>
              </div>
              <div className="classification-item priority-low">
                <div className="score-range">30-49</div>
                <div className="classification-info">
                  <h4>PRIORIDADE BAIXA</h4>
                  <p><Clock size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Aguardar - Considerar apenas se recursos abundantes</p>
                </div>
              </div>
              <div className="classification-item priority-consider">
                <div className="score-range">15-29</div>
                <div className="classification-info">
                  <h4>CONSIDERÁVEL</h4>
                  <p><HelpCircle size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Avaliar - Benefícios marginais, alto custo/risco</p>
                </div>
              </div>
              <div className="classification-item priority-avoid">
                <div className="score-range">0-14</div>
                <div className="classification-info">
                  <h4>NÃO RECOMENDADO</h4>
                  <p><X size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Evitar - Riscos superam benefícios</p>
                </div>
              </div>
            </div>
          </div>

          <div className="superpower-details">
            <h2>Detalhamento dos Super Poderes</h2>
            <div className="superpower-grid">
              <div className="superpower-card temporal">
                <h4><Clock size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Temporal</h4>
                <div className="superpower-stats">
                  <span>Custo: +25</span>
                  <span>Poder: +28</span>
                  <span>Risco: +22</span>
                  <span>Valor: +30</span>
                </div>
                <p>Manipulação do tempo - imprevisível mas revolucionário</p>
              </div>
              <div className="superpower-card dimensional">
                <h4><Zap size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Dimensional</h4>
                <div className="superpower-stats">
                  <span>Custo: +22</span>
                  <span>Poder: +30</span>
                  <span>Risco: +20</span>
                  <span>Valor: +28</span>
                </div>
                <p>Poderes dimensionais - pode escapar facilmente</p>
              </div>
              <div className="superpower-card warlike">
                <h4><Swords size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Bélico</h4>
                <div className="superpower-stats">
                  <span>Custo: +12</span>
                  <span>Poder: +35</span>
                  <span>Risco: +25</span>
                  <span>Valor: +8</span>
                </div>
                <p>Máximo poder ofensivo - extremamente perigoso</p>
              </div>
              <div className="superpower-card psychic">
                <h4><Brain size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Psíquico</h4>
                <div className="superpower-stats">
                  <span>Custo: +18</span>
                  <span>Poder: +25</span>
                  <span>Risco: +18</span>
                  <span>Valor: +20</span>
                </div>
                <p>Controle mental - pode detectar aproximação</p>
              </div>
              <div className="superpower-card elemental">
                <h4><Flame size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Elemental</h4>
                <div className="superpower-stats">
                  <span>Custo: +10</span>
                  <span>Poder: +22</span>
                  <span>Risco: +15</span>
                  <span>Valor: +12</span>
                </div>
                <p>Forças naturais - destrutivo mas controlável</p>
              </div>
              <div className="superpower-card technological">
                <h4><Cpu size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Tecnológico</h4>
                <div className="superpower-stats">
                  <span>Custo: +15</span>
                  <span>Poder: +18</span>
                  <span>Risco: +12</span>
                  <span>Valor: +18</span>
                </div>
                <p>Interface tecnológica - armas avançadas</p>
              </div>
              <div className="superpower-card biological">
                <h4><Dna size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Biológico</h4>
                <div className="superpower-stats">
                  <span>Custo: +8</span>
                  <span>Poder: +15</span>
                  <span>Risco: +10</span>
                  <span>Valor: +15</span>
                </div>
                <p>Mutações ativas - comportamento imprevisível</p>
              </div>
              <div className="superpower-card defensive">
                <h4><Shield size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Defensivo</h4>
                <div className="superpower-stats">
                  <span>Custo: +5</span>
                  <span>Poder: +8</span>
                  <span>Risco: +5</span>
                  <span>Valor: +10</span>
                </div>
                <p>Principalmente defesa - menor ameaça</p>
              </div>
            </div>
          </div>

          <div className="strategy-section">
            <div className="strategy-card">
              <Brain size={32} className="strategy-icon" />
              <h2>Sistema de Estratégias de Captura</h2>
              <p className="strategy-intro">
                Baseado nas características do Pato Primordial, o sistema automaticamente gera a melhor estratégia de captura,
                uma defesa aleatória que o pato pode ativar, e calcula a taxa de sucesso da operação.
              </p>

              <div className="strategies-grid">
                <div className="strategy-item">
                  <Plane size={20} className="strategy-icon" />
                  <h4>Bombardeio Aéreo</h4>
                  <p><strong>Quando:</strong> Patos muito altos (&gt;100cm) ou com muitas mutações (&gt;5)</p>
                  <p>Ataque coordenado do alto com força máxima</p>
                </div>

                <div className="strategy-item">
                  <Swords size={20} className="strategy-icon" />
                  <h4>Assalto Direto</h4>
                  <p><strong>Quando:</strong> Patos de tamanho médio (30-100cm) ou muito pesados (&gt;5kg)</p>
                  <p>Ataque frontal com força máxima</p>
                </div>

                <div className="strategy-item">
                  <Hexagon size={20} className="strategy-icon" />
                  <h4>Armadilha Estratégica</h4>
                  <p><strong>Quando:</strong> Patos muito pequenos (&lt;30cm) ou muito leves (&lt;500g)</p>
                  <p>Posicionamento de dispositivos de captura</p>
                </div>

                <div className="strategy-item">
                  <Theater size={20} className="strategy-icon" />
                  <h4>Tática de Distração</h4>
                  <p><strong>Quando:</strong> Patos despertos com 1-5 mutações</p>
                  <p>Desvio de atenção seguido de captura</p>
                </div>

                <div className="strategy-item">
                  <Ghost size={20} className="strategy-icon" />
                  <h4>Aproximação Furtiva</h4>
                  <p><strong>Quando:</strong> Patos em transe ou hibernação profunda</p>
                  <p>Infiltração silenciosa usando camuflagem avançada</p>
                </div>

                <div className="strategy-item">
                  <Waves size={20} className="strategy-icon" />
                  <h4>Emboscada Aquática</h4>
                  <p><strong>Quando:</strong> Patos em regiões de latitude &lt;-30</p>
                  <p>Ataque surpresa submerso</p>
                </div>

                <div className="strategy-item">
                  <ShieldAlert size={20} className="strategy-icon" />
                  <h4>Cerco Tático</h4>
                  <p><strong>Quando:</strong> Patos de altura média</p>
                  <p>Bloqueio estratégico de todas as rotas de fuga</p>
                </div>

                <div className="strategy-item">
                  <EyeOff size={20} className="strategy-icon" />
                  <h4>Infiltração Silenciosa</h4>
                  <p><strong>Quando:</strong> Patos pequenos e leves</p>
                  <p>Aproximação indetectável com supressão de sinais</p>
                </div>

                <div className="strategy-item">
                  <Bolt size={20} className="strategy-icon" />
                  <h4>Ataque Relâmpago</h4>
                  <p><strong>Quando:</strong> Patos despertos</p>
                  <p>Investida ultrarrápida antes de reação</p>
                </div>

                <div className="strategy-item">
                  <MoveRight size={20} className="strategy-icon" />
                  <h4>Manobra Envolvente</h4>
                  <p><strong>Quando:</strong> Patos em longitude distante</p>
                  <p>Ataque coordenado por múltiplos ângulos</p>
                </div>

                <div className="strategy-item">
                  <Bomb size={20} className="strategy-icon" />
                  <h4>Supressão de Área</h4>
                  <p><strong>Quando:</strong> Patos muito pesados ou com muitas mutações</p>
                  <p>Neutralização de zona com pulsos atordoantes</p>
                </div>

                <div className="strategy-item">
                  <Sparkles size={20} className="strategy-icon" />
                  <h4>Isca Holográfica</h4>
                  <p><strong>Quando:</strong> Patos despertos e em transe</p>
                  <p>Projeções para confundir e capturar</p>
                </div>

                <div className="strategy-item">
                  <Volume2 size={20} className="strategy-icon" />
                  <h4>Pulso Sônico</h4>
                  <p><strong>Quando:</strong> Patos em transe</p>
                  <p>Ondas de choque para desorientar o alvo</p>
                </div>

                <div className="strategy-item">
                  <Network size={20} className="strategy-icon" />
                  <h4>Rede de Contenção</h4>
                  <p><strong>Quando:</strong> Patos pequenos e em hibernação profunda</p>
                  <p>Malha energética expansiva inescapável</p>
                </div>

                <div className="strategy-item">
                  <Tornado size={20} className="strategy-icon" />
                  <h4>Inversão Gravitacional</h4>
                  <p><strong>Quando:</strong> Patos muito altos ou com muitas mutações</p>
                  <p>Manipulação de campo para imobilizar</p>
                </div>
              </div>

              <div className="defense-section">
                <h3><Shield size={24} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Defesas Possíveis</h3>
                <div className="defenses-grid">
                  <div className="defense-item"><Zap size={16} /> Escudo de Energia - Barreira energética deflectora</div>
                  <div className="defense-item"><Eye size={16} /> Campo de Camuflagem - Invisibilidade temporária</div>
                  <div className="defense-item"><Tornado size={16} /> Rajada de Teletransporte - Deslocamento instantâneo</div>
                  <div className="defense-item"><Brain size={16} /> Barreira Psíquica - Proteção mental</div>
                  <div className="defense-item"><Flame size={16} /> Proteção Elemental - Resistência natural</div>
                  <div className="defense-item"><Clock size={16} /> Distorção Temporal - Manipulação do tempo</div>
                  <div className="defense-item"><Shield size={16} /> Armadura Biológica - Tecido blindado regenerativo</div>
                  <div className="defense-item"><Sparkles size={16} /> Reflexão Quântica - Espelhamento de ataques</div>
                  <div className="defense-item"><TrendingUp size={16} /> Absorção Cinética - Conversão de impactos</div>
                  <div className="defense-item"><Cpu size={16} /> Campo Magnético - Repulsão de projéteis</div>
                  <div className="defense-item"><Zap size={16} /> Interferência Neural - Bloqueio de comandos</div>
                  <div className="defense-item"><Flame size={16} /> Cúpula de Plasma - Barreira incineradora</div>
                  <div className="defense-item"><Target size={16} /> Clonagem Defensiva - Cópias confusoras</div>
                  <div className="defense-item"><Moon size={16} /> Prisão Dimensional - Bolsão espacial</div>
                  <div className="defense-item"><Beaker size={16} /> Regeneração Acelerada - Cura instantânea</div>
                </div>
              </div>

              <div className="success-calculation">
                <h3><Calculator size={24} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Cálculo da Taxa de Sucesso</h3>
                <ul>
                  <li><strong>Base:</strong> 50% de chance</li>
                  <li><strong>Drone:</strong> Bateria, Combustível e Integridade afetam (+/-20%)</li>
                  <li><strong>Estado do Pato:</strong> Hibernação Profunda +30%, Transe +15%, Desperto +0%</li>
                  <li><strong>Mutações:</strong> Cada mutação reduz 3% de chance</li>
                  <li><strong>Tamanho/Peso:</strong> Espécimes muito grandes ou pesados reduzem chance</li>
                  <li><strong>Fator Aleatório:</strong> ±15% (imprevisibilidade da missão)</li>
                  <li><strong>Resultado:</strong> Taxa final entre 5% e 95%</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="tips-section">
            <div className="tips-card">
              <AlertTriangle size={32} className="tips-icon" />
              <h2>Dicas Estratégicas</h2>
              <div className="tips-grid">
                <div className="tip">
                  <h4><Target size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Alvos Ideais</h4>
                  <p>Patos em hibernação profunda com muitas mutações e poderes científicos</p>
                </div>
                <div className="tip">
                  <h4><AlertTriangle size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Evitar</h4>
                  <p>Patos despertos com poderes bélicos e muitas mutações em locais remotos</p>
                </div>
                <div className="tip">
                  <h4><MapPin size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Localização</h4>
                  <p>Proximidade da base DSIN reduz custos e riscos operacionais</p>
                </div>
                <div className="tip">
                  <h4><Dna size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> Mutações</h4>
                  <p>Aumentam tanto o valor científico quanto o risco - equilibrio é crucial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaptureLogicPage;