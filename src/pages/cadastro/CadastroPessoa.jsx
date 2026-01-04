import { useState } from 'react';
import './CadastroPessoa.css';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  mascaraCPF, 
  validarCPF, 
  mascaraData, 
  dataBRParaISO,
  calcularIdade,
  validarDataNaoFutura
} from '../../utils/validations';
import { FaCheckCircle, FaTimesCircle, FaCamera, FaUser } from 'react-icons/fa';

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const ETNIAS_IBGE = [
  'Branca',
  'Preta',
  'Parda',
  'Amarela',
  'Indígena',
  'Prefere não declarar'
];

function CadastroPessoa() {
  const navigate = useNavigate();
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [form, setForm] = useState({
    nome: '',
    data_nascimento_br: '',
    etnia: '',
    nacionalidade: 'Brasileira',
    cpf: '',
    rg: '',
    rg_uf: '',
    sexo: '',
    endereco: '',
    ocorrencia: '',
    observacoes: '',
    foto: '',
  });

  const idade = calcularIdade(form.data_nascimento_br);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpar erros quando o usuário começar a digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCPFChange = (e) => {
    const valor = e.target.value;
    const cpfFormatado = mascaraCPF(valor);
    setForm({ ...form, cpf: cpfFormatado });
    
    // Validar CPF em tempo real
    if (cpfFormatado.replace(/\D/g, '').length === 11) {
      const isValid = validarCPF(cpfFormatado);
      setValidFields({ ...validFields, cpf: isValid });
      setErrors({ ...errors, cpf: isValid ? '' : 'CPF inválido' });
    } else {
      setValidFields({ ...validFields, cpf: false });
      setErrors({ ...errors, cpf: '' });
    }
  };

  const handleDataChange = (e) => {
    const valor = e.target.value;
    const dataFormatada = mascaraData(valor);
    setForm({ ...form, data_nascimento_br: dataFormatada });
    
    // Validar data
    if (dataFormatada.length === 10) {
      const isValid = validarDataNaoFutura(dataFormatada);
      setValidFields({ ...validFields, data_nascimento: isValid });
      setErrors({ ...errors, data_nascimento: isValid ? '' : 'Data não pode ser futura' });
    } else {
      setValidFields({ ...validFields, data_nascimento: false });
      setErrors({ ...errors, data_nascimento: '' });
    }
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFoto(null);
      setPreview(null);
      return;
    }

    // Validar tipo de arquivo
    if (!file.type.match('image.*')) {
      setErrors({ ...errors, foto: 'Apenas arquivos de imagem são permitidos (JPG, PNG)' });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, foto: 'A imagem deve ter no máximo 5MB' });
      return;
    }

    setFoto(file);
    setErrors({ ...errors, foto: '' });
    
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (form.nome.trim().split(' ').length < 2) {
      newErrors.nome = 'Informe nome completo';
    }
    
    if (!form.data_nascimento_br) {
      newErrors.data_nascimento = 'Data de nascimento é obrigatória';
    } else if (form.data_nascimento_br.length !== 10) {
      newErrors.data_nascimento = 'Data inválida';
    } else if (!validarDataNaoFutura(form.data_nascimento_br)) {
      newErrors.data_nascimento = 'Data não pode ser futura';
    }
    
    if (form.cpf && form.cpf.replace(/\D/g, '').length === 11) {
      if (!validarCPF(form.cpf)) {
        newErrors.cpf = 'CPF inválido';
      }
    }
    
    if (form.rg && !form.rg_uf) {
      newErrors.rg_uf = 'UF do RG é obrigatória quando RG é informado';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let fotoUrl = '';
    
    if (foto) {
      const fileExt = foto.name.split('.').pop();
      const fileName = `${form.nome.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase
        .storage
        .from('fotos-pessoas')
        .upload(fileName, foto, { upsert: true });
      
      if (uploadError) {
        alert('Erro ao fazer upload da foto: ' + uploadError.message);
        return;
      }
      
      const { data: publicUrlData } = supabase
        .storage
        .from('fotos-pessoas')
        .getPublicUrl(fileName);
      fotoUrl = publicUrlData.publicUrl;
    }

    // Converter data BR para ISO
    const dataISO = dataBRParaISO(form.data_nascimento_br);
    
    const dadosEnvio = {
      nome: form.nome.trim(),
      data_nascimento: dataISO,
      etnia: form.etnia || null,
      nacionalidade: form.nacionalidade,
      cpf: form.cpf.replace(/\D/g, '') || null,
      rg: form.rg || null,
      rg_uf: form.rg_uf || null,
      sexo: form.sexo || null,
      endereco: form.endereco || null,
      ocorrencia: form.ocorrencia || null,
      observacoes: form.observacoes || null,
      foto: fotoUrl || null,
    };

    const { error } = await supabase
      .from('pessoas')
      .insert([dadosEnvio]);

    if (error) {
      alert('Erro ao cadastrar: ' + error.message);
    } else {
      alert('Cadastro realizado com sucesso!');
      // Limpar formulário
      setForm({
        nome: '',
        data_nascimento_br: '',
        etnia: '',
        nacionalidade: 'Brasileira',
        cpf: '',
        rg: '',
        rg_uf: '',
        sexo: '',
        endereco: '',
        ocorrencia: '',
        observacoes: '',
        foto: '',
      });
      setFoto(null);
      setPreview(null);
      setErrors({});
      setValidFields({});
    }
  };

  return (
    <div className="cadastro-container">
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Cadastro de Pessoa</h2>
          <p className="form-legend">* Campos obrigatórios</p>
        </div>

        {/* Seção 1: Identificação */}
        <section className="form-section">
          <h3 className="section-title">Identificação</h3>
          
          <div className="foto-section">
            <label className="field-label">
              Foto <span className="optional">(opcional)</span>
            </label>
            <div className="foto-upload-container">
              <div className="foto-preview-container">
                {preview ? (
                  <img src={preview} alt="Preview" className="foto-preview" />
                ) : (
                  <div className="foto-placeholder">
                    <FaUser size={32} />
                  </div>
                )}
              </div>
              <div className="foto-upload-actions">
                <label htmlFor="foto-input" className="btn-foto-upload">
                  <FaCamera /> {preview ? 'Trocar foto' : 'Selecionar foto'}
                </label>
                <input
                  id="foto-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFoto}
                  style={{ display: 'none' }}
                />
                <p className="foto-hint">JPG ou PNG, máximo 5MB</p>
                {errors.foto && <span className="error-message">{errors.foto}</span>}
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">
              Nome completo <span className="required">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: João da Silva"
              className={`form-input ${errors.nome ? 'input-error' : ''} ${form.nome && !errors.nome ? 'input-valid' : ''}`}
              required
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
            {form.nome && !errors.nome && <FaCheckCircle className="icon-valid" />}
          </div>

          <div className="field-group">
            <label className="field-label">
              Data de nascimento <span className="required">*</span>
            </label>
            <div className="date-group">
              <input
                type="text"
                name="data_nascimento_br"
                value={form.data_nascimento_br}
                onChange={handleDataChange}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className={`form-input ${errors.data_nascimento ? 'input-error' : ''} ${form.data_nascimento_br && !errors.data_nascimento ? 'input-valid' : ''}`}
                required
              />
              {idade !== null && !errors.data_nascimento && (
                <span className="idade-display">{idade} anos</span>
              )}
            </div>
            {errors.data_nascimento && <span className="error-message">{errors.data_nascimento}</span>}
            {form.data_nascimento_br && !errors.data_nascimento && <FaCheckCircle className="icon-valid" />}
          </div>
        </section>

        {/* Seção 2: Documentos */}
        <section className="form-section">
          <h3 className="section-title">Documentos</h3>
          
          <div className="field-group">
            <label className="field-label">
              CPF <span className="optional">(opcional)</span>
            </label>
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              className={`form-input ${errors.cpf ? 'input-error' : ''} ${validFields.cpf ? 'input-valid' : ''}`}
            />
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
            {validFields.cpf && <FaCheckCircle className="icon-valid" />}
            {form.cpf && !errors.cpf && !validFields.cpf && <FaTimesCircle className="icon-invalid" />}
            <p className="field-hint">Utilizado apenas para identificação. Não será compartilhado.</p>
          </div>

          <div className="field-group-row">
            <div className="field-group" style={{ flex: 2 }}>
              <label className="field-label">
                RG <span className="optional">(opcional)</span>
              </label>
              <input
                type="text"
                name="rg"
                value={form.rg}
                onChange={handleChange}
                placeholder="Número do RG"
                className="form-input"
              />
            </div>
            <div className="field-group" style={{ flex: 1 }}>
              <label className="field-label">
                UF <span className="required">*</span>
                {form.rg && <span className="required-text">(obrigatório se RG preenchido)</span>}
              </label>
              <select
                name="rg_uf"
                value={form.rg_uf}
                onChange={handleChange}
                className={`form-input ${errors.rg_uf ? 'input-error' : ''}`}
              >
                <option value="">Selecione</option>
                {UFS.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              {errors.rg_uf && <span className="error-message">{errors.rg_uf}</span>}
            </div>
          </div>
        </section>

        {/* Seção 3: Dados demográficos */}
        <section className="form-section">
          <h3 className="section-title">Dados demográficos</h3>
          
          <div className="field-group">
            <label className="field-label">
              Sexo <span className="optional">(opcional)</span>
            </label>
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
              <option value="Não informado">Não informado</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">
              Etnia/Raça <span className="optional">(opcional)</span>
            </label>
            <select
              name="etnia"
              value={form.etnia}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Selecione</option>
              {ETNIAS_IBGE.map(etnia => (
                <option key={etnia} value={etnia}>{etnia}</option>
              ))}
            </select>
            <p className="field-hint">Classificação conforme padrão IBGE</p>
          </div>

          <div className="field-group">
            <label className="field-label">
              Nacionalidade <span className="optional">(opcional)</span>
            </label>
            <input
              type="text"
              name="nacionalidade"
              value={form.nacionalidade}
              onChange={handleChange}
              placeholder="Ex: Brasileira"
              className="form-input"
            />
          </div>
        </section>

        {/* Seção 4: Ocorrência */}
        <section className="form-section">
          <h3 className="section-title">Ocorrência</h3>
          
          <div className="field-group">
            <label className="field-label">
              Endereço <span className="optional">(opcional)</span>
            </label>
            <input
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Endereço completo"
              className="form-input"
            />
          </div>

          <div className="field-group">
            <label className="field-label">
              Descrição da ocorrência <span className="optional">(opcional)</span>
            </label>
            <textarea
              name="ocorrencia"
              value={form.ocorrencia}
              onChange={handleChange}
              placeholder="Descreva objetivamente os fatos, sem juízo de valor."
              rows={4}
              className="form-textarea"
              maxLength={1000}
            />
            <p className="field-hint">{form.ocorrencia.length}/1000 caracteres</p>
          </div>

          <div className="field-group">
            <label className="field-label">
              Observações <span className="optional">(opcional)</span>
            </label>
            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              placeholder="Informações adicionais relevantes"
              rows={3}
              className="form-textarea"
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Salvar cadastro
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroPessoa;
