import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './Consulta.css';
import { useNavigate } from 'react-router-dom';

function Consulta() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPessoas() {
      setLoading(true);
      const { data, error } = await supabase
        .from('pessoas')
        .select('*')
        .order('id', { ascending: false });
      if (error) {
        alert('Erro ao buscar pessoas: ' + error.message);
      } else {
        setPessoas(data);
      }
      setLoading(false);
    }
    fetchPessoas();
  }, []);

  // Filtra pessoas pelo nome ou CPF
  const pessoasFiltradas = pessoas.filter((pessoa) => {
    const termo = busca.toLowerCase();
    return (
      pessoa.nome?.toLowerCase().includes(termo) ||
      pessoa.cpf?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="consulta-container">
      {/* Botão de sair */}
      <button
        type="button"
        className="btn-voltar-dashboard"
        onClick={() => navigate('/dashboard')}
        aria-label="Sair"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#fff',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="5" y1="5" x2="15" y2="15" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="5" x2="5" y2="15" stroke="#888" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <h2>Consulta de Pessoas</h2>
      <input
        className="consulta-busca"
        type="text"
        placeholder="Buscar por nome ou CPF..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="consulta-tabela">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data de Nascimento</th>
            </tr>
          </thead>
          <tbody>
            {pessoasFiltradas.map((pessoa) => (
              <tr
                key={pessoa.id}
                className="consulta-linha-clicavel"
                onClick={() => navigate(`/consulta/${pessoa.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  {pessoa.foto ? (
                    <img src={pessoa.foto} alt={pessoa.nome} style={{ width: 40, height: 55, objectFit: 'cover', borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
                  ) : (
                    <span style={{ color: '#aaa', fontSize: 12 }}>[Sem foto]</span>
                  )}
                </td>
                <td>{pessoa.nome}</td>
                <td>{pessoa.cpf}</td>
                <td>{pessoa.data_nascimento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Consulta; 