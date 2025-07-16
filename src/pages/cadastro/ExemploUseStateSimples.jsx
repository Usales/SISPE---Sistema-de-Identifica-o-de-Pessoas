import { useState } from 'react';

function ExemploUseStateSimples() {
  // Cria um estado para guardar o nome digitado
  const [nome, setNome] = useState('');

  // Função chamada sempre que o usuário digita algo
  const handleChange = (e) => {
    setNome(e.target.value); // Atualiza o estado com o novo valor
  };

  return (
    <div>
      <h3>Exemplo Simples de useState</h3>
      <input
        type="text"
        placeholder="Digite seu nome"
        value={nome}
        onChange={handleChange}
      />
      <p>O nome digitado é: <strong>{nome}</strong></p>
    </div>
  );
}

export default ExemploUseStateSimples; 