import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Dashboard.css';
import Footer from '../../components/Footer';
import { FaUsers, FaSearch, FaClock, FaCheckCircle } from 'react-icons/fa';
import video from '../../arquivos/SISPE.mp4';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPessoas: 0,
    consultasHoje: 0,
    ultimoCadastro: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Total de pessoas
        const { count: totalCount } = await supabase
          .from('pessoas')
          .select('*', { count: 'exact', head: true });

        // Último cadastro (ordena por id, que é auto-incremento)
        const { data: ultimoCadastroData } = await supabase
          .from('pessoas')
          .select('created_at')
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();

        setStats({
          totalPessoas: totalCount || 0,
          consultasHoje: 0, // Por enquanto, podemos deixar 0 ou implementar tracking
          ultimoCadastro: ultimoCadastroData?.created_at || null
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    return `há ${diffDays} dias`;
  };

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: 180, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ width: '100%' }}>
            <Navbar />
          </div>
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Visão Geral do Sistema</h1>
              <p className="dashboard-subtitle">Gerencie cadastros e consultas de pessoas</p>
            </div>

            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-card">
                <div className="stat-card-icon stat-icon-users">
                  <FaUsers />
                </div>
                <div className="stat-card-content">
                  <div className="stat-card-number">{loading ? '...' : stats.totalPessoas}</div>
                  <div className="stat-card-label">Pessoas cadastradas</div>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-card-icon stat-icon-search">
                  <FaSearch />
                </div>
                <div className="stat-card-content">
                  <div className="stat-card-number">{stats.consultasHoje}</div>
                  <div className="stat-card-label">Consultas realizadas hoje</div>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-card-icon stat-icon-clock">
                  <FaClock />
                </div>
                <div className="stat-card-content">
                  <div className="stat-card-number">{formatTimeAgo(stats.ultimoCadastro)}</div>
                  <div className="stat-card-label">Último cadastro</div>
                </div>
              </div>
            </div>

            <div className="dashboard-actions-grid">
              <div className="dashboard-action-card" onClick={() => navigate('/cadastro')}>
                <div className="action-card-icon">
                  <FaCheckCircle />
                </div>
                <h3 className="action-card-title">Cadastrar Pessoa</h3>
                <p className="action-card-description">Adicione novas pessoas ao sistema com dados completos e foto</p>
              </div>

              <div className="dashboard-action-card" onClick={() => navigate('/lista-pessoas')}>
                <div className="action-card-icon">
                  <FaSearch />
                </div>
                <h3 className="action-card-title">Consultar Registros</h3>
                <p className="action-card-description">Busque e visualize informações das pessoas cadastradas</p>
              </div>
            </div>

            <div className="dashboard-video-card">
              <h2 className="video-card-title">Demonstração do Sistema</h2>
              <div className="video-wrapper">
                <video
                  controls
                  autoPlay
                  loop
                  className="dashboard-video"
                >
                  <source src={video} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
            </div>

            <div className="dashboard-info-card">
              <h2 className="info-card-title">O que você pode fazer aqui</h2>
              <ul className="info-card-list">
                <li>Cadastrar pessoas com dados e foto</li>
                <li>Consultar registros rapidamente</li>
                <li>Controlar identificação em eventos</li>
                <li>Sistema online e gratuito</li>
              </ul>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
export default Dashboard;