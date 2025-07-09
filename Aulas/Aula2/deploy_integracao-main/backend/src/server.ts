import express, { Application, Request, Response } from "express";  // Importa o Express e o tipo Application
import cors from "cors";                                            // Importa o middleware CORS
import AppDataSource from "./config/data-source";               // Importa a configuração do TypeORM
import userRoutes from "./routes/UserRoutes";                       // Importa as rotas de usuários
import taskRoutes from "./routes/TaskRoutes";                       // Importa as rotas de tarefas
import dotenv from "dotenv";                                        // Importa o dotenv para carregar variáveis de ambiente

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app: Application = express(); // Cria uma instância do Express

app.use(express.json()); // Configura o Express para interpretar JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Configura o Express para interpretar dados URL-encoded (formulários)

// Habilita CORS para permitir requisições de outros domínios
app.use(cors({
    credentials: true, // Permite credenciais (cookies, headers de autenticação, etc.)
}));

// Configura as rotas de usuários e tarefas
app.use("/api", userRoutes); // Rotas de usuários sob o prefixo /api
app.use("/api", taskRoutes); // Rotas de tarefas sob o prefixo /api

// Função para inicializar o servidor
const startServer = async () => {
    try {
        // Inicializa a conexão com o banco de dados
        await AppDataSource.initialize();
        console.log("Database connection established successfully.");

        // Define a porta do servidor
        const PORT = Number(process.env.PORT || "3000");

        // Inicia o servidor na porta especificada
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

// Chama a função para iniciar o servidor
startServer(); // Inicia o servidor e a conexão com o banco de dados