import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

function Dashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 200, display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '98%' }}>
          <Navbar />
        </div>
        <div style={{ padding: 32, flex: 1 }}>
          <h1>Bem-vindo ao Dashboard!</h1>
          <p>Você está logado no SISPE.</p>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;