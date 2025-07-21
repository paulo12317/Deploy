document.addEventListener("DOMContentLoaded", function () {
  // Referências aos elementos da página
  const createForm = document.getElementById("createForm"); // Formulário de cadastro/edição
  const tabelaLivrosBody = document.querySelector(".tabela-livros tbody");
  // Corpo da tabela para listar livros
  const mensagemSucesso = document.getElementById("mensagemSucesso"); // Div para mensagens de sucesso/erro
  const cancelarEdicaoBtn = document.getElementById("cancelarEdicao"); // Botão para cancelar edição
  const hiddenId = document.getElementById("hiddenId"); // Input oculto para armazenar o id do livro durante edição

  // URL base da API REST para operações CRUD dos livros
  const apiBase = "http://localhost:3000/livro";

  /**
   * Exibe uma mensagem na tela com cor verde para sucesso e vermelha para erro.
   * A mensagem desaparece após 3 segundos automaticamente.
   * 
   * @param {string} texto - Texto da mensagem a exibir
   * @param {boolean} sucesso - true para mensagem de sucesso (verde), false para erro (vermelho)
   */
  function exibirMensagem(texto, sucesso = true) {
    mensagemSucesso.textContent = texto;
    mensagemSucesso.style.color = sucesso ? "green" : "red";
    mensagemSucesso.style.display = "block";

    setTimeout(() => {
      mensagemSucesso.style.display = "none";
      mensagemSucesso.textContent = "";
    }, 3000);
  }

  /**
   * Busca todos os livros na API e exibe na tabela.
   * Se não houver livros, exibe mensagem na tabela.
   * Em caso de erro na requisição, exibe mensagem de erro.
   */
  async function listarLivros() {
    try {
      const res = await fetch(apiBase);
      const data = await res.json();

      if (!data || data.length === 0) {
        tabelaLivrosBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum livro encontrado.</td></tr>`;
        return;
      }

      // Monta as linhas da tabela dinamicamente com os livros
      tabelaLivrosBody.innerHTML = data
        .map(
          (livro) => `
        <tr>
          <td>${livro.id ?? "-"}</td>
          <td>${livro.name}</td>
          <td>${livro.tipo}</td>
          <td>${livro.ano}</td>
          <td>
            <button class="editar" data-id="${livro.id}">Editar</button>
            <button class="excluir" data-id="${livro.id}">Excluir</button>
          </td>
        </tr>`
        )
        .join("");
    } catch (err) {
      exibirMensagem("Erro ao listar livros", false);
    }
  }

  /**
   * Manipulador do envio do formulário de cadastro/edição.
   * Detecta se é criação ou edição com base no campo oculto 'hiddenId'.
   * Valida os campos obrigatórios antes de enviar.
   * Atualiza a lista após operação com sucesso.
   * Exibe mensagens de sucesso ou erro.
   * 
   * @param {Event} e - Evento de submit do formulário
   */
  async function salvarLivro(e) {
    e.preventDefault();

    const id = hiddenId.value;
    const name = createForm.querySelector('input[name="name"]').value.trim();
    const tipo = createForm.querySelector('input[name="tipo"]').value.trim();
    const ano = parseInt(createForm.querySelector('input[name="ano"]').value);

    if (!name || !tipo || !ano) {
      exibirMensagem("Preencha todos os campos.", false);
      return;
    }

    try {
      let res, data;

      if (id) {
        // Edita um livro existente
        res = await fetch(`${apiBase}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, tipo, ano }),
        });
        data = await res.json();

        if (res.ok) {
          exibirMensagem("Livro atualizado com sucesso");
        } else {
          exibirMensagem(data.message || "Erro ao atualizar", false);
        }
      } else {
        // Cria um novo livro
        res = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, tipo, ano }),
        });
        data = await res.json();

        if (res.ok) {
          exibirMensagem("Livro cadastrado com sucesso");
        } else {
          exibirMensagem(data.message || "Erro ao cadastrar", false);
        }
      }

      // Limpa formulário e estado de edição após sucesso
      createForm.reset();
      hiddenId.value = "";
      cancelarEdicaoBtn.style.display = "none";

      // Atualiza a lista de livros
      listarLivros();
    } catch (err) {
      exibirMensagem("Erro de rede: " + err.message, false);
    }
  }

  /**
   * Solicita a exclusão de um livro pelo seu ID após confirmação do usuário.
   * Atualiza a lista após exclusão com sucesso.
   * Exibe mensagens de sucesso ou erro.
   * 
   * @param {string} id - ID do livro a ser deletado
   */
  async function deletarLivro(id) {
    if (!confirm("Tem certeza que deseja deletar este livro?")) return;

    try {
      const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });

      if (res.status === 204) {
        exibirMensagem("Livro deletado com sucesso");
        listarLivros();
      } else {
        const data = await res.json();
        exibirMensagem(data.message || "Erro ao deletar", false);
      }
    } catch (err) {
      exibirMensagem("Erro ao deletar livro", false);
    }
  }

  /**
   * Carrega os dados de um livro no formulário para edição,
   * baseado no ID fornecido.
   * Exibe mensagem informando o modo edição.
   * 
   * @param {string} id - ID do livro a ser editado
   */
  async function carregarLivroParaEdicao(id) {
    try {
      const res = await fetch(`${apiBase}/${id}`);
      if (!res.ok) throw new Error("Livro não encontrado");
      const livro = await res.json();

      // Preenche os campos do formulário com os dados do livro
      hiddenId.value = livro.id;
      createForm.querySelector('input[name="name"]').value = livro.name;
      createForm.querySelector('input[name="tipo"]').value = livro.tipo;
      createForm.querySelector('input[name="ano"]').value = livro.ano;

      // Mostra botão cancelar edição e mensagem
      cancelarEdicaoBtn.style.display = "inline-block";
      exibirMensagem(`Editando livro ID ${livro.id}`);
    } catch (error) {
      exibirMensagem(error.message, false);
    }
  }

  // Configuração dos eventos

  // Ao enviar o formulário, tenta salvar (criar ou editar)
  createForm.addEventListener("submit", salvarLivro);

  // Botão cancelar edição: limpa formulário e esconde botão cancelar
  cancelarEdicaoBtn.addEventListener("click", () => {
    createForm.reset();
    hiddenId.value = "";
    cancelarEdicaoBtn.style.display = "none";
    mensagemSucesso.style.display = "none";
  });

  // Delegação de eventos para os botões Editar e Excluir na tabela
  tabelaLivrosBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("editar")) {
      const id = e.target.dataset.id;
      carregarLivroParaEdicao(id);
    }
    if (e.target.classList.contains("excluir")) {
      const id = e.target.dataset.id;
      deletarLivro(id);
    }
  });

  // Inicializa a listagem ao carregar a página
  listarLivros();
});

/**
   * Código responsável por reproduzir um som quando a página for clicada
   */
const som = document.getElementById('somBiblioteca'); // Elemento de áudio com id 

// Quando o usuário clicar em qualquer lugar da página, desativa o mute e inicia o som
document.addEventListener('click', () => {
  som.muted = false;
  som.play(); // Reproduz o som (útil para contornar restrições de autoplay)
});
