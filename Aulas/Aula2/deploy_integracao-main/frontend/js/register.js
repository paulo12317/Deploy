const registerForm = document.getElementById("registerForm");
const API_BASE_URL = "https://deploy_backend.onrender.com/api"
//postgresql://db_task_r56q_user:Np9xtIAKuEZIi4k8Sgj9bO0dYwNooTaU@dpg-d1o198qdbo4c73cdr2jg-a.oregon-postgres.render.com/db_task_r56q  https://deploy-backend-teste.onrender.com/api
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            alert("Usuário criado com sucesso! Faça login.");
            window.location.href = "index.html";
        } else {
            const data = await res.json();
            alert(data.message || "Erro ao registrar");
        }
    } catch (error) {
        alert("Erro na requisição: " + error.message);
    }
});