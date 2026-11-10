# 📚 BibliWeb

Aplicação web completa para gerenciamento e acompanhamento de leituras de livros, desenvolvida como trabalho da disciplina de **Programação Web 2**.

O **BibliWeb** permite cadastrar livros, acompanhar o progresso de leitura (páginas lidas, porcentagem e status), registrar resenhas/avaliações, visualizar estatísticas com gráficos interativos e gerenciar perfis de usuário, além de disponibilizar uma API REST para integração externa.

---

## 🚀 Funcionalidades

### 📖 Gerenciamento de Livros
- **Cadastro de Livros:** Registro completo com título, autor, editora, gênero, formato e número total de páginas.
- **Edição e Remoção:** Atualização de detalhes do livro e exclusão do acervo.
- **Acompanhamento de Leitura / Progresso:**
  - Registro de páginas lidas e cálculo automático da porcentagem de progresso.
  - Atualização do status de leitura (ex: *Não Iniciado*, *Em Leitura*, *Concluído*).
- **Resenhas e Avaliações:** Criação e consulta de resenhas para livros concluídos ou em andamento.
- **Filtros e Visualização:** Listagem visual com suporte a filtros por gênero literário e busca.

### 👤 Usuários e Estatísticas
- **Perfil de Usuário:** Cadastro e alteração de perfil com seleção de avatar.
- **Painel de Estatísticas:** Visualização do histórico e métricas de leitura com gráficos informativos utilizando [Chart.js](https://www.chartjs.org/).

### 🔌 API REST (`/api`)
Endpoints para operações com livros:
- `POST /api/cadLivro` - Cadastrar novo livro via JSON.
- `GET /api/consultaLivro/:_id` - Buscar informações de um livro por ID.
- `PUT /api/alteraLivro/:_id` - Atualizar dados de um livro.
- `DELETE /api/deletaLivro/:_id` - Remover livro.

---

## 🛠️ Tecnologias Utilizadas

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **Template Engine:** [Handlebars (HBS)](https://handlebarsjs.com/)
- **Banco de Dados:** [MongoDB](https://www.mongodb.com/) (Driver Nativo `mongodb`)
- **Visualização de Dados:** [Chart.js](https://www.chartjs.org/)
- **Estilização e Layout:** HTML5, CSS3, Bootstrap/CSS Customizado

---

## 📂 Estrutura do Projeto

```text
Web2-BibliWeb/
├── bin/
│   └── www                   # Script de inicialização do servidor HTTP
├── controller/
│   ├── controllerApi.js      # Controladores da API REST
│   ├── controllerIndex.js    # Controladores da página inicial e navegação
│   ├── controllerLivro.js    # Lógica de negócio de livros e leituras
│   └── controllerUsuario.js  # Lógica de negócio de usuários e métricas
├── model/
│   ├── livrosMongo.js        # Operações com coleção de livros no MongoDB
│   └── userMongo.js          # Operações com coleção de usuários no MongoDB
├── public/
│   ├── images/               # Imagens, capas de gêneros e avatares
│   └── stylesheets/          # Estilos CSS da aplicação
├── routes/
│   ├── index.js              # Rotas principais da aplicação
│   ├── rotasApi.js           # Rotas da API REST
│   ├── rotasLivro.js         # Rotas de gerenciamento de livros
│   └── rotasUsuario.js       # Rotas de gerenciamento de usuário
├── views/                    # Telas renderizadas em Handlebars (.hbs)
├── app.js                    # Configurações do Express e middlewares
└── package.json              # Dependências e scripts do projeto
```

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

1. [Node.js](https://nodejs.org/) (versão 16.x ou superior recomendada)
2. [MongoDB](https://www.mongodb.com/try/download/community) rodando localmente na porta padrão (`mongodb://127.0.0.1:27017`)

---

## ⚙️ Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/Web2-BibliWeb.git
   cd Web2-BibliWeb
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o serviço do MongoDB:**
   Certifique-se de que a instância local do MongoDB está ativa. No Windows, você pode verificar pelos Serviços ou executando `mongod`.

4. **Inicie a aplicação:**
   ```bash
   npm start
   ```

5. **Acesse no navegador:**
   Abra seu navegador e acesse:
   ```text
   http://localhost:3000
   ```

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos na disciplina de Programação Web 2. Sinta-se livre para utilizar, modificar e contribuir!
