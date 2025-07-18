import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import video from '../../arquivos/SISPE.mp4';
import './Dashboard.css';
import Footer from '../../components/Footer';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '98%' }}>
            <Navbar />
          </div>
          <div style={{ padding: 32, flex: 1 }}>
            <h1>Bem-vindo ao Dashboard!</h1>
            <p>Você está logado no SISPE.</p>
            <div className="dashboard-containers-row">
              <div className='container'>
                <h1 style={{flex: 1 , marginLeft: 25, marginTop: 15}}>Como funcionamos?</h1>
                <p style={{flex: 1 , marginLeft: 25, marginTop: 15, fontSize:17}}>A SISPE, foi um projeto do desenvolvedor de software, Gabriel Henriques Sales.</p>
                <p style={{flex: 1 , marginLeft: 25, marginTop: 15, fontSize:17}}>Com o objetivo de facilitar o processo de identificação de pessoas em eventos, ou em locais onde é necessário um controle de acesso mais rigoroso. </p>
                <p style={{flex: 1 , marginLeft: 25, marginTop: 15, fontSize:17}}>O sistema permite o cadastro de pessoas, com informações como nome, CPF, foto e outros dados relevantes.</p>
                <p style={{flex: 1 , marginLeft: 25, marginTop: 15, fontSize:17}}>Além disso, o SISPE conta com uma funcionalidade de busca rápida, que permite encontrar pessoas cadastradas de forma eficiente.</p>
                <p style={{flex: 1 , marginLeft: 25, marginTop: 15, fontSize:17}}>Funcionando 100% de maneira online e sem custo, entretanto a versão que temos aqui é uma versão pública onde qualquer pessoa com acesso ao site pode acessar e utilizar</p>
              </div>
              <div className='container1'>
                <video
                  width="101%"
                  height="101%"
                  controls
                  autoPlay
                  loop
                  style={{ borderRadius: 15 }}
                >
                  <source src={video} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Dashboard;