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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        navigate('/dashboard'); // Redireciona para o dashboard
      } else {
        setError('Usuário ou senha inválidos.');
        setPassword('');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-bg">
      <form
        className="login-form"
        onSubmit={handleSubmit}
        aria-label="Formulário de login do SISPE"
      >
        <h1 className="login-title">SISPE</h1>
        <h2 className="login-subtitle">Sistema de Identificação de Pessoas</h2>
        <h3 className="login-subtitle" style={{fontSize: '1.1rem', marginBottom: 8}}>Login</h3>

        {error && (
          <div
            className="login-error"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <label htmlFor="username" className="login-label">
          Usuário
        </label>
        <input
          ref={usernameRef}
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          className="login-input"
          placeholder="Digite seu usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          aria-required="true"
          aria-label="Usuário"
        />

        <label htmlFor="password" className="login-label">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="login-input"
          placeholder="Digite sua senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-required="true"
          aria-label="Senha"
        />

        <button
          type="submit"
          className="login-btn"
          disabled={loading}
          aria-busy={loading}
        >
          {loading && <span className="login-spinner"></span>}
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login; 