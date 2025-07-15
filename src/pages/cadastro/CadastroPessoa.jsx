import { useState } from 'react';
import './CadastroPessoa.css'; // Certifique-se de criar este arquivo CSS

function CadastroPessoa() {
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    etnia: '',
    nacionalidade: '',
    cpf: '',
    rg: '',
    sexo: '',
    endereco: '',
    observacoes: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para o backend
    alert('Cadastro enviado! (simulação)');
  };

  return (
    <div className="cadastro-bg">
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <h2>Cadastro de Pessoa</h2>
        <div className="foto-section">
          <label className="foto-label">Foto:</label>
          <input type="file" accept="image/*" onChange={handleFoto} />
          {preview && <img src={preview} alt="Prévia da foto" className="foto-preview" />}
        </div>
        <label>Nome completo:
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
        </label>
        <label>Data de nascimento:
          <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} required />
        </label>
        <label>Etnia:
          <input type="text" name="etnia" value={form.etnia} onChange={handleChange} />
        </label>
        <label>Nacionalidade:
          <input type="text" name="nacionalidade" value={form.nacionalidade} onChange={handleChange} />
        </label>
        <label>CPF:
          <input type="text" name="cpf" value={form.cpf} onChange={handleChange} />
        </label>
        <label>RG:
          <input type="text" name="rg" value={form.rg} onChange={handleChange} />
        </label>
        <label>Sexo:
          <select name="sexo" value={form.sexo} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </label>
        <label>Endereço:
          <input type="text" name="endereco" value={form.endereco} onChange={handleChange} />
        </label>
        <label>Observações:
          <textarea name="observacoes" value={form.observacoes} onChange={handleChange} rows={3} />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroPessoa; 