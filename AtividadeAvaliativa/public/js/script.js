// Aguarda o carregamento completo do DOM antes de executar qualquer lógica
document.addEventListener("DOMContentLoaded", function () {

  // Obtém os elementos HTML usados na lógica de login/cadastro
  const loginForm = document.getElementById("loginForm");         // Formulário de login
  const cadastroForm = document.getElementById("cadastroForm");   // Formulário de cadastro
  const formulario = document.getElementById("formulario");       // Container principal do formulário (pode conter login ou cadastro)
  const mensagemSucesso = document.getElementById("mensagemSucesso"); // Mensagem exibida após sucesso em login ou cadastro
  const voltarBtn = document.getElementById("voltarBtn");         // Botão "Voltar" (opcional, usado após sucesso para voltar ao formulário)

  /**
   * Função que processa o login do usuário.
   * Impede o envio tradicional do formulário, coleta os dados e envia uma requisição POST para a API.
   * Se o login for bem-sucedido, exibe mensagem e redireciona para a tela principal.
   */
  async function realizarLogin(e) {
    e.preventDefault(); // Evita recarregar a página

    // Coleta os dados inseridos nos campos
    const email = document.getElementById("email").value;
    const password = document.getElementById("senha").value;

    try {
      // Envia os dados para a API de login
      const res = await fetch("http://localhost:3000/api/usersLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }) // Converte os dados para JSON
      });

      if (res.ok) {
        // Se o login foi bem-sucedido
        mensagemSucesso.style.display = "block"; // Exibe a mensagem de sucesso
        formulario.style.display = "none";       // Esconde o formulário
        setTimeout(() => {
          window.location.href = "telaPrincipal.html"; // Redireciona após 1.5s
        }, 1500);
      } else {
        // Se houve erro, exibe a mensagem da API (ou uma mensagem genérica)
        const data = await res.json();
        alert(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message); // Erro de rede ou execução
    }
  }

  /**
   * Função que processa o cadastro de novo usuário.
   * Verifica se as senhas coincidem e envia uma requisição POST para a API.
   * Após sucesso, exibe mensagem e redireciona para a página de login.
   */
  async function realizarCadastro(e) {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    // Coleta os dados do formulário
    const name = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;

    // Verifica se a senha e confirmação são iguais
    if (password !== confirmar) {
      alert("As senhas não coincidem.");
      return; // Impede o envio se houver erro
    }

    try {
      // Envia os dados para a API de cadastro
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password }) // Dados enviados
      });

      if (res.ok) {
        // Cadastro bem-sucedido
        mensagemSucesso.style.display = "block";
        formulario.style.display = "none";
        setTimeout(() => {
          window.location.href = "entrar.html"; // Redireciona para a tela de login
        }, 1500);
      } else {
        // Exibe mensagem de erro retornada pela API
        const data = await res.json();
        alert(data.message || "Erro ao cadastrar");
      }
    } catch (error) {
      alert("vtf: " + error.message); // Falha de rede ou código
    }
  }

  /**
   * Associa o evento de envio do formulário de login à função de login
   */
  if (loginForm) {
    loginForm.addEventListener("submit", realizarLogin);
  }

  /**
   * Associa o evento de envio do formulário de cadastro à função de cadastro
   */
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", realizarCadastro);
  }

  /**
   * Associa o clique no botão "Voltar" à função que reexibe o formulário
   * Isso permite que o usuário tente novamente após uma mensagem de sucesso
   */
  if (voltarBtn) {
    voltarBtn.addEventListener("click", function () {
      mensagemSucesso.style.display = "none";  // Esconde a mensagem de sucesso
      formulario.style.display = "block";      // Mostra novamente o formulário
      if (loginForm) loginForm.reset();        // Limpa os campos de login
      if (cadastroForm) cadastroForm.reset();  // Limpa os campos de cadastro
    });
  }
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
