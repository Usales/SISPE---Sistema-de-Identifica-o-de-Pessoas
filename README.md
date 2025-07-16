# SISPE - Sistema de Pessoas

## Login Simulado
- **Usuário:** `admin`
- **Senha:** `1234`
- O login é apenas simulado no frontend para acesso ao sistema.

## Funcionalidades
- Cadastro de pessoas com foto (upload para Supabase Storage)
- Consulta de pessoas com busca por nome ou CPF e visualização da foto
- Visualização detalhada de cada pessoa, com opção de baixar PDF dos dados e foto
- Edição dos dados da pessoa diretamente pela tela de detalhes
- Listagem de ocorrências (se implementado)

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Acesse o projeto e rode:
   ```bash
   npm run dev
   ```

## Observações
- Para gerar PDF dos dados e foto, é usado `jspdf` e `html2canvas`.
- O upload de fotos só funciona se o bucket e as policies estiverem corretamente configurados.
- Para editar dados, clique no lápis vermelho na tela de detalhes da pessoa.

---

Se tiver dúvidas, consulte o código ou abra uma issue!
