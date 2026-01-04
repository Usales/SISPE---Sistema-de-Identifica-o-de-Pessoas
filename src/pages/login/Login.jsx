import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { supabase } from '../../supabaseClient';
import { mascaraCPF } from '../../utils/validations';
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleCpfChange = (e) => {
    const valor = e.target.value;
    // Se começar com "admin", não aplica máscara
    if (valor.toLowerCase().startsWith('admin')) {
      setCpf(valor);
    } else {
      const cpfFormatado = mascaraCPF(valor);
      setCpf(cpfFormatado);
    }
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cpf || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    // ACESSO ADMIN HARDCODED
    const usernameLower = cpf.toLowerCase().trim();
    if (usernameLower === 'admin' && password === '1234') {
      setTimeout(() => {
        navigate('/dashboard');
        setLoading(false);
      }, 500);
      return;
    }

    // Validação de CPF apenas se não for "admin"
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setError('CPF inválido.');
      setLoading(false);
      return;
    }

    try {
      // Transforma o CPF em email fake
      const fakeEmail = `${cpfLimpo}@sispe.com`;
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: password,
      });

      if (loginError) {
        setError('CPF ou senha inválidos.');
        setPassword('');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erro ao tentar logar. Tente novamente.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const cpfLimpo = cpf.replace(/\D/g, '');
  const isFormValid = (cpf.toLowerCase().trim() === 'admin' || cpfLimpo.length === 11) && password.length > 0;

  return (
    <div className="login-bg">
      <form 
        className="login-form" 
        onSubmit={handleLoginSubmit}
        aria-label="Formulário de login do SISPE"
      >
        <div className="login-header">
          <h1 className="login-title">SISPE</h1>
          <h2 className="login-subtitle">Sistema de Identificação de Pessoas</h2>
          <p className="login-restricted">Acesso restrito</p>
        </div>
        
        {error && (
          <div className="login-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <div className="login-fields">
          <div className="field-group">
            <label className="field-label">
              CPF ou Usuário
            </label>
            <input
              type="text"
              className="login-input"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              autoComplete="username"
            />
          </div>

          <div className="field-group">
            <label className="field-label">
              Senha
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input password-input"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading || !isFormValid} 
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Entrando...
              </>
            ) : (
              <>
                <FaLock /> Entrar
              </>
            )}
          </button>
        </div>

        <div className="login-security-notice">
          <FaShieldAlt className="security-icon" />
          <span>Acesso monitorado e registrado</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
