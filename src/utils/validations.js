// Função para validar CPF
export function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false; // Todos os dígitos iguais
  
  let soma = 0;
  let resto;
  
  // Valida primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  // Valida segundo dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

// Função para aplicar máscara de CPF
export function mascaraCPF(valor) {
  const apenasNumeros = valor.replace(/\D/g, '');
  if (apenasNumeros.length <= 3) return apenasNumeros;
  if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
  if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
  return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
}

// Função para aplicar máscara de data (dd/mm/aaaa)
export function mascaraData(valor) {
  const apenasNumeros = valor.replace(/\D/g, '');
  if (apenasNumeros.length <= 2) return apenasNumeros;
  if (apenasNumeros.length <= 4) return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
  return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
}

// Converter data BR para formato ISO (yyyy-mm-dd)
export function dataBRParaISO(dataBR) {
  if (!dataBR) return '';
  const partes = dataBR.split('/');
  if (partes.length !== 3) return '';
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

// Converter data ISO para formato BR (dd/mm/aaaa)
export function dataISOParaBR(dataISO) {
  if (!dataISO) return '';
  const partes = dataISO.split('-');
  if (partes.length !== 3) return '';
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Calcular idade a partir de data de nascimento
export function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;
  
  // Se for formato ISO (yyyy-mm-dd)
  let partes;
  if (dataNascimento.includes('-')) {
    partes = dataNascimento.split('-');
    if (partes.length !== 3) return null;
    // Formato ISO: yyyy-mm-dd
    const nascimento = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }
  
  // Se for formato BR (dd/mm/yyyy)
  partes = dataNascimento.split('/');
  if (partes.length !== 3) return null;
  
  const nascimento = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
}

// Validar se data não é futura
export function validarDataNaoFutura(dataBR) {
  if (!dataBR) return true;
  const partes = dataBR.split('/');
  if (partes.length !== 3) return false;
  
  const data = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  return data <= hoje;
}

// Formatar CPF para exibição
export function formatarCPF(cpf) {
  if (!cpf) return '';
  const apenasNumeros = cpf.replace(/\D/g, '');
  if (apenasNumeros.length !== 11) return cpf;
  return mascaraCPF(apenasNumeros);
}
