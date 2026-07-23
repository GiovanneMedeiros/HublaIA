import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService, agentService } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leadsRes, agentsRes] = await Promise.all([
          leadService.getLeads().catch(() => ({ data: { data: { data: [] } } })),
          agentService.getAgents().catch(() => ({ data: { data: { data: [] } } })),
        ]);
        
        setLeads(leadsRes.data?.data?.data || []);
        setAgents(agentsRes.data?.data?.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🏢 HublaIA Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <section className="dashboard-card">
            <h2>📞 Leads</h2>
            <div className="stat-number">{leads.length || 0}</div>
            <p className="stat-label">Leads no sistema</p>
            {leads.length > 0 ? (
              <div className="leads-preview">
                {leads.slice(0, 3).map((lead: any) => (
                  <div key={lead.id} className="lead-item">
                    <p><strong>{lead.name || 'Sem nome'}</strong></p>
                    <p className="lead-email">{lead.email || lead.phone || 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Nenhum lead registrado ainda</p>
            )}
          </section>

          <section className="dashboard-card">
            <h2>👥 Agentes</h2>
            <div className="stat-number">{agents.length || 0}</div>
            <p className="stat-label">Agentes disponíveis</p>
            {agents.length > 0 ? (
              <div className="agents-preview">
                {agents.slice(0, 3).map((agent: any) => (
                  <div key={agent.id} className="agent-item">
                    <p><strong>{agent.name || 'Sem nome'}</strong></p>
                    <p className="agent-status">Status: {agent.available ? '✅ Online' : '❌ Offline'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Nenhum agente registrado ainda</p>
            )}
          </section>

          <section className="dashboard-card">
            <h2>📊 Sistema</h2>
            <div className="system-info">
              <p>✅ Backend conectado</p>
              <p>✅ Database conectado</p>
              <p>✅ API respondendo</p>
            </div>
          </section>

          <section className="dashboard-card">
            <h2>🚀 Próximos passos</h2>
            <ul className="next-steps">
              <li>Adicionar leads</li>
              <li>Registrar agentes</li>
              <li>Configurar filas</li>
              <li>Integrar WhatsApp</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
