import { useState } from 'react';
import './CadastroUsuario.css';
import InputField from '../cadastro/InputField';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

function CadastroUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    empresa: '',
    telefone: '',
    cargo: '',
    cpf: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Limpa erro quando usuário digita
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setForm({ ...form, cpf: value });
  };

  const validateForm = () => {
    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      setError('Todos os campos obrigatórios devem ser preenchidos');
      return false;
    }

    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem');
      return false;
    }

    if (form.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Digite um email válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          data: {
            nome: form.nome,
            empresa: form.empresa,
            telefone: form.telefone,
            cargo: form.cargo
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Criar perfil do usuário na tabela 'usuarios'
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user.id,
            nome: form.nome,
            email: form.email,
            empresa: form.empresa,
            telefone: form.telefone,
            cargo: form.cargo,
            data_criacao: new Date().toISOString()
          }
        ]);

      if (profileError) {
        throw profileError;
      }

      alert('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
      navigate('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-usuario-bg">
      {/* Botão de voltar */}
      <button
        type="button"
        className="btn-voltar"
        onClick={() => navigate('/login')}
        aria-label="Voltar ao login"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="5" y1="15" x2="15" y2="15" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="5" x2="5" y2="15" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <form className="cadastro-usuario-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Criar Conta</h2>
          <p>Cadastre-se para acessar o SISPE</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-section">
          <h3>Informações Pessoais</h3>
          <InputField 
            label="Nome completo *" 
            name="nome" 
            value={form.nome} 
            onChange={handleChange} 
            required 
          />
          <InputField 
            label="Email *" 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
          <InputField 
            label="Telefone" 
            type="tel" 
            name="telefone" 
            value={form.telefone} 
            onChange={handleChange} 
          />
          <InputField 
            label="CPF *" 
            name="cpf" 
            value={form.cpf} 
            onChange={handleCpfChange} 
            required 
          />
        </div>

        <div className="form-section">
          <h3>Opções Profissionais</h3>
          <InputField 
            label="Empresa" 
            name="empresa" 
            value={form.empresa} 
            onChange={handleChange} 
          />
          <InputField 
            label="Cargo" 
            name="cargo" 
            value={form.cargo} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-section">
          <h3>Segurança</h3>
          <InputField 
            label="Senha *" 
            type="password" 
            name="senha" 
            value={form.senha} 
            onChange={handleChange} 
            required 
          />
          <InputField 
            label="Confirmar senha *" 
            type="password" 
            name="confirmarSenha" 
            value={form.confirmarSenha} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn-cadastrar"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Criar Conta'}
        </button>

        <div className="login-link">
          <p>Já tem uma conta? <button type="button" onClick={() => navigate('/login')}>Fazer login</button></p>
        </div>
      </form>
    </div>
  );
}

export default CadastroUsuario; 