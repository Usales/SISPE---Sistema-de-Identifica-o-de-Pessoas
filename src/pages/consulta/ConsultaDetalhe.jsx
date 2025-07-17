import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import './Consulta.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ConsultaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pessoa, setPessoa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const pdfRef = useRef();

  useEffect(() => {
    async function fetchPessoa() {
      setLoading(true);
      const { data, error } = await supabase
        .from('pessoas')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        alert('Erro ao buscar pessoa: ' + error.message);
      } else {
        setPessoa(data);
        setForm(data);
      }
      setLoading(false);
    }
    fetchPessoa();
  }, [id]);

  // Função para converter imagem URL em base64
  async function getBase64FromUrl(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        resolve(reader.result);
      };
    });
  }

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let y = 20;
    pdf.setFontSize(18);
    pdf.text('Detalhes da Pessoa', 15, y);
    y += 10;

    // Adiciona a foto se existir
    if (pessoa.foto) {
      try {
        const imgData = await getBase64FromUrl(pessoa.foto);
        pdf.addImage(imgData, 'JPEG', 15, y, 40, 55); // altura aumentada para 60mm
      } catch (e) {
        pdf.setFontSize(10);
        pdf.text('Erro ao carregar foto', 15, y + 10);
      }
      y += 65;
    }

    pdf.setFontSize(12);
    const fields = [
      ['Nome', pessoa.nome],
      ['Data de Nascimento', pessoa.data_nascimento],
      ['Etnia', pessoa.etnia],
      ['Nacionalidade', pessoa.nacionalidade],
      ['CPF', pessoa.cpf],
      ['RG', pessoa.rg],
      ['Sexo', pessoa.sexo],
      ['Endereço', pessoa.endereco],
      ['Ocorrência', pessoa.ocorrencia],
      ['Observações', pessoa.observacoes],
    ];
    fields.forEach(([label, value]) => {
      pdf.text(`${label}: ${value || ''}`, 15, y);
      y += 8;
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });
    pdf.save(`dados_${pessoa.nome || 'pessoa'}.pdf`);
  };

  const handleEdit = () => {
    setEditando(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('pessoas')
      .update(form)
      .eq('id', id);
    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Dados atualizados com sucesso!');
      setPessoa(form);
      setEditando(false);
    }
  };

  // Adicionar função de deletar
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar esta pessoa? Esta ação não pode ser desfeita.')) {
      const { error } = await supabase
        .from('pessoas')
        .delete()
        .eq('id', id);
      if (error) {
        alert('Erro ao deletar: ' + error.message);
      } else {
        alert('Pessoa deletada com sucesso!');
        navigate('/consulta');
      }
    }
  };

  if (loading) return <div className="consulta-container"><p>Carregando...</p></div>;
  if (!pessoa) return <div className="consulta-container"><p>Pessoa não encontrada.</p></div>;

  return (
    <div className="consulta-container">
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 24,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label="Voltar"
      >
        <span style={{ fontSize: 22, color: '#888' }}>&larr;</span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Detalhes da Pessoa</h2>
        <button
          onClick={handleEdit}
          style={{
            marginLeft: 8,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            boxShadow: '0 2px 8px rgba(255,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
          aria-label="Editar"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="11" fill="#fff" />
            <path d="M6 15.5V17H7.5L14.13 10.37L12.63 8.87L6 15.5ZM16.71 8.04C17.1 7.65 17.1 7.02 16.71 6.63L15.37 5.29C14.98 4.9 14.35 4.9 13.96 5.29L12.13 7.12L14.88 9.87L16.71 8.04Z" fill="#e53935" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          style={{
            marginLeft: 8,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
          aria-label="Deletar"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="11" fill="#fff" />
            <path d="M7 9h8M9 9v6m4-6v6M5 7h12v2H5V7zm2-2h6v2H7V5z" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
        {pessoa.foto && (
          <div style={{ margin: '24px 0', textAlign: 'center' }}>
            <img src={pessoa.foto} alt="Foto da pessoa" style={{ maxWidth: 180, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            <br />
            <button
              onClick={handleDownloadPDF}
              style={{
                marginTop: 16,
                padding: '8px 18px',
                borderRadius: 8,
                background: '#fff',
                border: '1px solid #ccc',
                color: '#333',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: 15
              }}
            >
              Baixar PDF
            </button>
          </div>
        )}
        <div ref={pdfRef} style={{ flex: 1 }}>
          <table className="consulta-tabela">
            <tbody>
              <tr><th>Nome</th><td>{editando ? <input name="nome" value={form.nome || ''} onChange={handleChange} /> : pessoa.nome}</td></tr>
              <tr><th>Data de Nascimento</th><td>{editando ? <input name="data_nascimento" value={form.data_nascimento || ''} onChange={handleChange} /> : pessoa.data_nascimento}</td></tr>
              <tr><th>Etnia</th><td>{editando ? <input name="etnia" value={form.etnia || ''} onChange={handleChange} /> : pessoa.etnia}</td></tr>
              <tr><th>Nacionalidade</th><td>{editando ? <input name="nacionalidade" value={form.nacionalidade || ''} onChange={handleChange} /> : pessoa.nacionalidade}</td></tr>
              <tr><th>CPF</th><td>{editando ? <input name="cpf" value={form.cpf || ''} onChange={handleChange} /> : pessoa.cpf}</td></tr>
              <tr><th>RG</th><td>{editando ? <input name="rg" value={form.rg || ''} onChange={handleChange} /> : pessoa.rg}</td></tr>
              <tr><th>Sexo</th><td>{editando ? <input name="sexo" value={form.sexo || ''} onChange={handleChange} /> : pessoa.sexo}</td></tr>
              <tr><th>Endereço</th><td>{editando ? <input name="endereco" value={form.endereco || ''} onChange={handleChange} /> : pessoa.endereco}</td></tr>
              <tr><th>Ocorrência</th><td>{editando ? <input name="ocorrencia" value={form.ocorrencia || ''} onChange={handleChange} /> : pessoa.ocorrencia}</td></tr>
              <tr><th>Observações</th><td>{editando ? <textarea name="observacoes" value={form.observacoes || ''} onChange={handleChange} rows={3} /> : pessoa.observacoes}</td></tr>
            </tbody>
          </table>
          {editando && (
            <button
              onClick={handleSave}
              style={{
                marginTop: 18,
                padding: '8px 24px',
                borderRadius: 8,
                background: '#e53935',
                border: 'none',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: 16,
                boxShadow: '0 2px 8px rgba(229,57,53,0.15)'
              }}
            >
              Salvar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultaDetalhe; 