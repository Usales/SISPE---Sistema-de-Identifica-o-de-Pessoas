import { useState } from 'react';
import './CadastroPessoa.css'; // Certifique-se de criar este arquivo CSS
import InputField from './InputField';
import SelectField from './SelectField';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

function CadastroPessoa() {
  const navigate = useNavigate();
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    data_nascimento: '',
    etnia: '',
    nacionalidade: '',
    cpf: '',
    rg: '',
    sexo: '',
    endereco: '',
    ocorrencia: '',
    observacoes: '',
    foto: '', // novo campo para URL da foto
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fotoUrl = '';
    // Se houver foto, faz upload para o Storage
    if (foto) {
      const fileExt = foto.name.split('.').pop();
      const fileName = `${form.nome.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('fotos-pessoas')
        .upload(fileName, foto, { upsert: true });
      if (uploadError) {
        alert('Erro ao fazer upload da foto: ' + uploadError.message);
        return;
      }
      // Pega a URL pública
      const { data: publicUrlData } = supabase
        .storage
        .from('fotos-pessoas')
        .getPublicUrl(fileName);
      fotoUrl = publicUrlData.publicUrl;
    }
    // Envia os dados do formulário para a tabela 'pessoas' no Supabase
    const { data, error } = await supabase
      .from('pessoas')
      .insert([{ ...form, foto: fotoUrl }]);

    if (error) {
      alert('Erro ao cadastrar: ' + error.message);
    } else {
      alert('Cadastro enviado com sucesso!');
      // Limpa o formulário se desejar
      setForm({
        nome: '',
        data_nascimento: '',
        etnia: '',
        nacionalidade: '',
        cpf: '',
        rg: '',
        sexo: '',
        endereco: '',
        ocorrencia: '',
        observacoes: '',
        foto: '',
      });
      setFoto(null);
      setPreview(null);
    }
  };

  return (
    <div className="cadastro-bg">
      {/* Botão de voltar para o dashboard */}
      <button
        type="button"
        className="btn-voltar-dashboard"
        onClick={() => navigate('/dashboard')}
        aria-label="Voltar ao dashboard"
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
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <h2>Cadastro de Pessoa</h2>
        <div className="foto-section">
          <label className="foto-label">Foto:</label>
          <input type="file" accept="image/*" onChange={handleFoto} />
          {preview && <img src={preview} alt="Prévia da foto" className="foto-preview" />}
        </div>
        <InputField label="Nome completo:" name="nome" value={form.nome} onChange={handleChange} required />
        <InputField label="Data de nascimento:" type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} required />
        <InputField label="Etnia:" name="etnia" value={form.etnia} onChange={handleChange} />
        <InputField label="Nacionalidade:" name="nacionalidade" value={form.nacionalidade} onChange={handleChange} />
        <InputField label="CPF:" name="cpf" value={form.cpf} onChange={handleChange} />
        <InputField label="RG:" name="rg" value={form.rg} onChange={handleChange} />
        <SelectField label="Sexo:" name="sexo" value={form.sexo} onChange={handleChange} options={["Masculino", "Feminino"]} />
        <InputField label="Ocorrência:" name="ocorrencia" value={form.ocorrencia} onChange={handleChange} />
        <InputField label="Endereço:" name="endereco" value={form.endereco} onChange={handleChange} />
        <label>Observações:
          <textarea name="observacoes" value={form.observacoes} onChange={handleChange} rows={3} />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>  
  );
}

export default CadastroPessoa; 