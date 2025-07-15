# SISPE-FRONTEND

Painel administrativo para cadastro e gestão de pessoas, desenvolvido em **React** com **React Router**.

## ✨ Funcionalidades

- **Login Simulado:**  
  - Usuário: `admin`  
  - Senha: `1234`  
  - Feedback visual, validação, loading e redirecionamento automático para o dashboard.

- **Dashboard:**  
  - Página inicial após login, com navegação para as principais funcionalidades.

- **Cadastro de Pessoas:**  
  - Formulário completo e responsivo.
  - Upload de foto com preview.
  - Campos: nome, data de nascimento, etnia, nacionalidade, CPF, RG, sexo, endereço e observações.
  - Validação de campos e feedback ao usuário.

- **Sidebar e Navbar:**  
  - Navegação moderna e estilizada para cadastro, consulta, edição, visualização, ocorrências, upload de imagens e logout.

- **Acessibilidade e Layout:**  
  - Formulários acessíveis.
  - Layout centralizado, responsivo e sem barras de rolagem duplas.
  - Scroll na página inteira.

- **Organização de Código:**  
  - Componentes organizados em subpastas.
  - Rotas estruturadas com React Router.
  - Imports e arquivos desnecessários removidos.

## 🚀 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/SISPE-FRONTEND.git
   cd SISPE-FRONTEND
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o projeto:**
   ```bash
   npm start
   ```

4. **Acesse:**  
   [http://localhost:3000](http://localhost:3000)

## 🛠️ Tecnologias utilizadas

- React
- React Router
- CSS tradicional (sem frameworks)
- (Pronto para integração com backend)

## 📁 Estrutura de pastas

```
src/
  components/
    Sidebar/
    Navbar/
    ...
  pages/
    Dashboard/
    CadastroPessoa/
    ...
  routes/
  styles/
public/
```

## 📋 Observações

- O login é simulado apenas no front-end.
- O sistema está pronto para receber integrações com backend (API REST).
- O layout e os componentes seguem boas práticas de acessibilidade e usabilidade.

## 👨‍💻 Contribuição

Sinta-se à vontade para abrir issues, sugerir melhorias ou enviar pull requests!
