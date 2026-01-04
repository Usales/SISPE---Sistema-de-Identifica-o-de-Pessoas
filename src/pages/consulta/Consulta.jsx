import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './Consulta.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { dataISOParaBR, calcularIdade, formatarCPF } from '../../utils/validations';
import { FaSearch, FaUser, FaEye, FaEdit, FaFileAlt, FaChevronLeft, FaChevronRight, FaSpinner, FaArrowLeft } from 'react-icons/fa';

function Consulta() {
  const [pessoas, setPessoas] = useState([]);
  const [pessoasFiltradas, setPessoasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });
  const navigate = useNavigate();
  
  const itensPorPagina = 20;

  useEffect(() => {
    async function fetchPessoas() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('pessoas')
          .select('*')
          .order('nome', { ascending: true });
        
        if (error) {
          console.error('Erro ao buscar pessoas:', error);
          alert('Erro ao buscar pessoas: ' + error.message);
        } else {
          setPessoas(data || []);
          setPessoasFiltradas(data || []);
        }
      } catch (err) {
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPessoas();
  }, []);

  // Debounce para busca
  useEffect(() => {
    if (!busca.trim()) {
      setPessoasFiltradas(pessoas);
      setPaginaAtual(1);
      setBuscando(false);
      return;
    }

    setBuscando(true);
    const timeoutId = setTimeout(() => {
      const termo = busca.toLowerCase().trim();
      const apenasNumeros = termo.replace(/\D/g, '');
      
      const filtradas = pessoas.filter((pessoa) => {
        // Busca por nome (parcial ou primeiro + último)
        const nomeMatch = pessoa.nome?.toLowerCase().includes(termo);
        
        // Busca por CPF (com ou sem máscara)
        const cpfLimpo = pessoa.cpf?.replace(/\D/g, '');
        const cpfMatch = apenasNumeros.length >= 3 && cpfLimpo?.includes(apenasNumeros);
        
        // Busca por RG
        const rgMatch = pessoa.rg?.toLowerCase().includes(termo);
        
        return nomeMatch || cpfMatch || rgMatch;
      });
      
      setPessoasFiltradas(filtradas);
      setPaginaAtual(1);
      setBuscando(false);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [busca, pessoas]);

  // Ordenação
  const handleOrdenar = (campo) => {
    setOrdenacao(prev => {
      if (prev.campo === campo) {
        return { campo, direcao: prev.direcao === 'asc' ? 'desc' : 'asc' };
      }
      return { campo, direcao: 'asc' };
    });
  };

  // Aplicar ordenação
  const pessoasOrdenadas = [...pessoasFiltradas].sort((a, b) => {
    const { campo, direcao } = ordenacao;
    let valorA = a[campo] || '';
    let valorB = b[campo] || '';
    
    if (campo === 'data_nascimento') {
      valorA = new Date(valorA);
      valorB = new Date(valorB);
    } else {
      valorA = String(valorA).toLowerCase();
      valorB = String(valorB).toLowerCase();
    }
    
    if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
    if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginação
  const totalPaginas = Math.ceil(pessoasOrdenadas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pessoasPaginas = pessoasOrdenadas.slice(inicio, fim);

  const handleVer = (id) => {
    navigate(`/consulta/${id}`);
  };

  const handleEditar = (id) => {
    // Por enquanto navega para detalhe, depois pode criar página de edição
    navigate(`/consulta/${id}?edit=true`);
  };

  const handleNovaOcorrencia = (id) => {
    // Por enquanto navega para detalhe, depois pode criar modal/fluxo específico
    navigate(`/consulta/${id}?ocorrencia=true`);
  };

  return (
    <div className="consulta-container">
      <div className="consulta-header">
        <div className="header-left">
          <button 
            className="btn-voltar"
            onClick={() => navigate('/dashboard')}
            title="Voltar ao dashboard"
          >
            <FaArrowLeft />
          </button>
          <h2>Consulta de Pessoas</h2>
        </div>
        <button 
          className="btn-cadastrar"
          onClick={() => navigate('/cadastro')}
        >
          + Cadastrar pessoa
        </button>
      </div>

      <div className="busca-container">
        <div className="busca-wrapper">
          <FaSearch className="busca-icon" />
          <input
            className="consulta-busca"
            type="text"
            placeholder="Digite nome, CPF ou RG"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {buscando && <FaSpinner className="busca-spinner" />}
        </div>
      </div>

      {loading ? (
        <div className="estado-loading">
          <FaSpinner className="spinner" />
          <p>Carregando registros...</p>
        </div>
      ) : pessoasOrdenadas.length === 0 ? (
        <div className="estado-vazio">
          <FaUser className="estado-vazio-icon" />
          <h3>
            {busca.trim() 
              ? 'Nenhuma pessoa encontrada com esses dados'
              : 'Nenhum registro carregado'
            }
          </h3>
          <p>
            {busca.trim()
              ? 'Verifique o CPF ou cadastre um novo registro.'
              : 'Utilize o campo acima para buscar por uma pessoa ou cadastre um novo registro.'
            }
          </p>
          {!busca.trim() && (
            <button 
              className="btn-cadastrar-vazio"
              onClick={() => navigate('/cadastro')}
            >
              + Cadastrar pessoa
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Tabela Desktop */}
          <div className="tabela-wrapper">
            <table className="consulta-tabela">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th 
                    className="sortable" 
                    onClick={() => handleOrdenar('nome')}
                  >
                    Nome {ordenacao.campo === 'nome' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>CPF</th>
                  <th 
                    className="sortable" 
                    onClick={() => handleOrdenar('data_nascimento')}
                  >
                    Nascimento {ordenacao.campo === 'data_nascimento' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Idade</th>
                  <th className="th-acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pessoasPaginas.map((pessoa) => {
                  const dataNasc = dataISOParaBR(pessoa.data_nascimento);
                  const idade = calcularIdade(pessoa.data_nascimento);
                  
                  return (
                    <tr key={pessoa.id}>
                      <td>
                        <div className="foto-cell">
                          {pessoa.foto ? (
                            <img 
                              src={pessoa.foto} 
                              alt={pessoa.nome} 
                              className="foto-avatar"
                            />
                          ) : (
                            <div className="foto-placeholder-small">
                              <FaUser />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="td-nome">{pessoa.nome}</td>
                      <td>{formatarCPF(pessoa.cpf)}</td>
                      <td>{dataNasc || '-'}</td>
                      <td>{idade !== null ? `${idade} anos` : '-'}</td>
                      <td className="td-acoes">
                        <div className="acoes-buttons">
                          <button
                            className="btn-acao btn-ver"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVer(pessoa.id);
                            }}
                            title="Ver detalhes"
                          >
                            <FaEye /> Ver
                          </button>
                          <button
                            className="btn-acao btn-editar"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditar(pessoa.id);
                            }}
                            title="Editar"
                          >
                            <FaEdit /> Editar
                          </button>
                          <button
                            className="btn-acao btn-ocorrencia"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNovaOcorrencia(pessoa.id);
                            }}
                            title="Nova ocorrência"
                          >
                            <FaFileAlt /> + Ocorrência
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards Mobile */}
          <div className="cards-mobile">
            {pessoasPaginas.map((pessoa) => {
              const dataNasc = dataISOParaBR(pessoa.data_nascimento);
              const idade = calcularIdade(pessoa.data_nascimento);
              
              return (
                <div key={pessoa.id} className="card-pessoa">
                  <div className="card-pessoa-header">
                    {pessoa.foto ? (
                      <img 
                        src={pessoa.foto} 
                        alt={pessoa.nome} 
                        className="card-foto"
                      />
                    ) : (
                      <div className="card-foto-placeholder">
                        <FaUser />
                      </div>
                    )}
                    <div className="card-info">
                      <h4>{pessoa.nome}</h4>
                      <p>{formatarCPF(pessoa.cpf)}</p>
                      {dataNasc && <p>{dataNasc} • {idade !== null ? `${idade} anos` : ''}</p>}
                    </div>
                  </div>
                  <div className="card-acoes">
                    <button
                      className="btn-acao btn-ver"
                      onClick={() => handleVer(pessoa.id)}
                    >
                      <FaEye /> Ver
                    </button>
                    <button
                      className="btn-acao btn-editar"
                      onClick={() => handleEditar(pessoa.id)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="btn-acao btn-ocorrencia"
                      onClick={() => handleNovaOcorrencia(pessoa.id)}
                    >
                      <FaFileAlt /> + Ocorrência
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="paginacao">
              <button
                className="btn-pagina"
                onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                disabled={paginaAtual === 1}
              >
                <FaChevronLeft /> Anterior
              </button>
              <span className="pagina-info">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                className="btn-pagina"
                onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima <FaChevronRight />
              </button>
            </div>
          )}

          {/* Info de resultados */}
          <div className="resultados-info">
            Mostrando {pessoasPaginas.length} de {pessoasOrdenadas.length} {pessoasOrdenadas.length === 1 ? 'pessoa' : 'pessoas'}
            {busca.trim() && ` para "${busca}"`}
          </div>
        </>
      )}
    </div>
  );
}

export default Consulta;
