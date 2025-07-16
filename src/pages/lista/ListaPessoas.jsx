import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function ListaPessoas() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPessoas() {
      setLoading(true);
      const { data, error } = await supabase
        .from('pessoas')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        alert('Erro ao buscar pessoas: ' + error.message);
      } else {
        setPessoas(data);
      }
      setLoading(false);
    }

    fetchPessoas();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Lista de Pessoas Cadastradas</h2>
      <ul>
        {pessoas.map((pessoa) => (
          <li key={pessoa.id}>
            <strong>{pessoa.nome}</strong> - {pessoa.cpf} - {pessoa.data_nascimento}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaPessoas; 