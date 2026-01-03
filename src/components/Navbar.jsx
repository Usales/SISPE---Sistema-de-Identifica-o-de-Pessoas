import './Navbar.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Usuário');
  const [userInitials, setUserInitials] = useState('U');

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Tenta buscar nome do perfil
        const { data } = await supabase
          .from('usuarios')
          .select('nome')
          .eq('id', user.id)
          .single();
        
        if (data?.nome) {
          setUserName(data.nome);
          const initials = data.nome
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          setUserInitials(initials);
        } else {
          // Fallback para admin
          setUserName('Administrador');
          setUserInitials('AD');
        }
      } else {
        setUserName('Administrador');
        setUserInitials('AD');
      }
    }
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">SISPE</div>
      <div className="navbar-user-section">
        <span className="navbar-username">{userName}</span>
        <div className="navbar-avatar">{userInitials}</div>
        <button className="navbar-logout-btn" onClick={handleLogout} title="Sair">
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 