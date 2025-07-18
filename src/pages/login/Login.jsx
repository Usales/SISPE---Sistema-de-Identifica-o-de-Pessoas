import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { supabase } from '../../supabaseClient';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    senha: '',
    confirmarSenha: ''
  });
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  // Foco automático no campo de usuário ao montar
  // useEffect(() => { usernameRef.current && usernameRef.current.focus(); }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);

    // ACESSO ADMIN HARDCODED
    if (username === 'admin' && password === '1234') {
      navigate('/dashboard');
      setLoading(false);
      return;
    }

    try {
      // Transforma o CPF em email fake
      const fakeEmail = `${username.replace(/\D/g, '')}@sispe.com`;
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: password,
      });

      if (loginError) {
        setError('Usuário ou senha inválidos.');
        setPassword('');
      } else {
        // Login realizado com sucesso!
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erro ao tentar logar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validação dos campos
    if (!formData.nome || !formData.cpf || !formData.senha || !formData.confirmarSenha) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Validação básica de CPF (formato)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(formData.cpf)) {
      setError('CPF deve estar no formato: 000.000.000-00');
      return;
    }

    setLoading(true);

    try {
      // Usar o CPF como "email" para o Supabase Auth (adicionando um domínio fake)
      const fakeEmail = `${formData.cpf.replace(/\D/g, '')}@sispe.com`;
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            cpf: formData.cpf
          }
        }
      });
      if (authError) {
        throw authError;
      }
      // Salvar dados na tabela 'usuarios'
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user.id,
            nome: formData.nome,
            cpf: formData.cpf,
            email: fakeEmail,
            data_criacao: new Date().toISOString()
          }
        ]);
      if (profileError) {
        throw profileError;
      }
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      setIsLoginMode(true);
      setFormData({
        nome: '',
        cpf: '',
        senha: '',
        confirmarSenha: ''
      });
    } catch (error) {
      if (error && error.message) {
        setError('Erro: ' + error.message);
      } else if (typeof error === 'string') {
        setError('Erro: ' + error);
      } else {
        setError('Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setFormData({ ...formData, cpf: value });
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setUsername('');
    setPassword('');
    setFormData({
      nome: '',
      cpf: '',
      senha: '',
      confirmarSenha: ''
    });
  };

  return (
    <div className="login-bg">
      <form 
        className="login-form" 
        onSubmit={isLoginMode ? handleLoginSubmit : handleCadastroSubmit}
        aria-label={isLoginMode ? "Formulário de login do SISPE" : "Formulário de cadastro do SISPE"}
      >
        <h1 className="login-title">SISPE</h1>
        <h2 className="login-subtitle">Sistema de Identificação de Pessoas</h2>
        <h3 className="login-subtitle">Acesse abaixo:</h3>
        
        {error && (
          <div className="login-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {isLoginMode ? (
          // Modo Login
          <>
            <label className='label-title'>CPF</label>
            <input
              type="text"
              className="login-input"
              placeholder="Digite admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />

            <label className='label-title'>Senha</label>
            <input
              type="password"
              className="login-input"
              placeholder="Digite 1234"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button type="submit" className="login-btn" disabled={loading} aria-busy={loading}>
              {loading && <span className="login-spinner"></span>}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </>
        ) : null}
      </form>
    </div>
  );
}

export default Login;
