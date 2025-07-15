import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  // Foco automático no campo de usuário ao montar
  // useEffect(() => { usernameRef.current && usernameRef.current.focus(); }, []);

  const handleSubmit = (e) => {// handleSubmit é chamado sempre que o formulário é enviado (pelo botão ou pelo Enter)
    e.preventDefault();//Previne reinicialização da página ao enviar o formulário
    setError('');//Limpa qualquer erro anterior

    // Validação simples para verificar se os campos estão preenchidos
    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);// Define o estado de carregamento para verdadeiro
  
    // Simula uma requisição de login
    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        console.log('Login realizado! Redirecionando para /dashboard');
        navigate('/dashboard');// Redireciona para a página de dashboard
      } else {
        setError('Usuário ou senha inválidos.');
        setPassword('');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}aria-label="Formulário de login do SISPE">
        <h1 className="login-title">SISPE</h1>
        <h2 className="login-subtitle">Sistema de Identificação de Pessoas</h2>
        <h3 className="login-subtitle">Login</h3>
        {error && (<div className="login-error" role="alert" aria-live="assertive">{error}</div>)}

        <label className='label-title'>Usuário</label>
          <input
            type="text"
            className="login-input"
            placeholder="Digite seu usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

        <label className='label-title'>Senha</label>

          <input
            type="password"
            className="login-input"
            placeholder="Digite sua senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

        <button type="submit" className="login-btn" disabled={loading} aria-busy={loading}>

          {loading && <span className="login-spinner"></span>}
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login;
