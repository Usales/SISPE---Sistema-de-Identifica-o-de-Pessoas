import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">Painel</div>
      <ul className="sidebar-links">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/cadastro">Cadastrar Pessoas</a></li>
        <li><a href="/lista-pessoas">Consulta</a></li>
        <li><a href="/">Sair</a></li>
      </ul>
    </aside>
  );
}

export default Sidebar; 