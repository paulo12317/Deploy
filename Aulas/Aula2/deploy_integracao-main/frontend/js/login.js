const loginForm = document.getElementById("loginForm");
const API_BASE_URL = "https://deploy_backend.onrender.com/api"


loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // necessário para o cookie JWT
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            alert("Login realizado com sucesso!");
            // Redirecionar para a página do dashboard ou outra página após o login
            window.location.href = "dashboard.html";
        } else {
            const data = await res.json();
            alert(data.message || "Erro ao fazer login");
        }
    } catch (error) {
        alert("Erro na requisição: " + error.message);
    }
});