import './Sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserPlus, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '../supabaseClient';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/cadastro', label: 'Cadastrar Pessoas', icon: FaUserPlus },
    { path: '/lista-pessoas', label: 'Consulta', icon: FaSearch },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Painel</div>
      <ul className="sidebar-links">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={isActive ? 'sidebar-link active' : 'sidebar-link'}
              >
                <Icon className="sidebar-icon" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button onClick={handleLogout} className="sidebar-link sidebar-link-logout">
            <FaSignOutAlt className="sidebar-icon" />
            <span>Sair</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar; 