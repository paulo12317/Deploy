# 📚 Trabalho Avaliativo: Biblioteca

Bem-vindo(a) à **Biblioteca da Danielle Yasmin Dias Padilha**, um projeto completo de cadastro e gerenciamento de livros feito com HTML, CSS, JavaScript e Node.js com banco de dados **MySQLite**. Este projeto foi desenvolvido com carinho em tons terrosos e elegantes para proporcionar uma experiência agradável 🌰📖.

---

## 🎨 Tema Visual

> Paleta baseada em tons marrons para trazer aconchego e identidade visual elegante ao sistema.

---

## 🚀 Funcionalidades

- ✅ Cadastrar livros (nome, tipo, ano)
- 🔍 Buscar livros por ID
- ✏️ Editar livros já cadastrados
- ❌ Deletar livros existentes
- 📄 Listar automaticamente todos os livros ao abrir a página
- 📦 Armazenamento no banco de dados via API (MySQLite)

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML + CSS + JavaScript puro
- **Backend:** Node.js + Express
- **Banco de Dados:** SQLite (usado via TypeORM)
- **Servidor Local:** http://localhost:3000

---

## 📁 Estrutura do Projeto

```bash
📁 AtividadeAvaliativa/
├── 📁 node_modules/
├── 📁 public/
│   ├── 📁 css/
│   │   └── style.css
│   ├── 📁 img/
│   │   └── biblioteca.png
|   |   └── cafe.png
│   ├── 📁 js/
│   │   ├── livros.js
│   │   └── script.js
│   ├── 📁 music/
│   │   └── biblioteca.mp4
├── 📄 cadastrar.html
├── 📄 entrar.html
├── 📄 telaPrincipal.html
├── 📁 src/
│   ├── 📁 controller/
│   │   ├── livrosController.ts
│   │   └── userController.ts
│   ├── 📁 database/
│   │   └── data-source.ts
│   ├── 📁 models/
│   │   ├── Livros.ts
│   │   └── user.ts
│   ├── 📁 routes/
│   │   ├── RoutesLivros.ts
│   │   ├── RoutesUser.ts
│   │   └── server.ts
├── 📄 .env
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 tsconfig.json
```

---

## 🧪 Como Rodar o Projeto Localmente

### 1️⃣ Backend (API)

> ⚙️ Requisitos: Node.js + SQLite

```bash
# Clone o repositório
git clone https://github.com/DanizitaDs

# Acesse a pasta do projeto
cd AtividadeAvaliativa

# Instale as dependências
npm install

# Rode o servidor
npm run dev
```

🔗 A API estará disponível em: `http://localhost:3000/livro`

---

### 2️⃣ Frontend (Interface)

> ⚠️ O frontend acessa a API diretamente pela porta 3000. Certifique-se que o backend esteja rodando.

```bash
# Acesse o frontend no navegador
http://localhost:3000/cadastrar.html
```

---

## 💡 Dica

Caso deseje usar o Live Server (extensão do VSCode), certifique-se de que o backend já esteja em execução e o caminho da API esteja correto no JS (`http://localhost:3000/livro`).

---

## 👩‍💻 Autora

Desenvolvido com 💛 por **Danielle Yasmin Dias Padilha**  
🔗 GitHub: [github.com/DanizitaDs](https://github.com/DanizitaDs)

---

## 🧸 Agradecimentos

A todos os professores e colegas que acompanharam esse desenvolvimento 📘✨  
Projeto avaliado como parte do conteúdo de aprendizado prático.
