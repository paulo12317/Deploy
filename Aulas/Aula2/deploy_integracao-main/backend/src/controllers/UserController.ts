import { Request, Response } from "express";            // Tipos do Express para requisição e resposta
import { User } from "../models/User";                  // Modelo/entidade User
import AppDataSource from "../config/data-source";  // Configuração da conexão com o banco de dados
import bcrypt from "bcryptjs";                          // Biblioteca para hash de senhas
import jwt from "jsonwebtoken";                         // Biblioteca para manipulação de Tokens JWT (Authenticação)
import dotenv from "dotenv";                            // Biblioteca para carregar variáveis de ambiente

dotenv.config();                                        // Carrega as variáveis de ambiente do arquivo .env

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret; // Obtém a chave secreta para JWT do ambiente

// Verifica se a variável de ambiente JWT_SECRET está definida
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

// Obtém o repositório do TypeORM para a entidade User
// Isso permite realizar operações de CRUD no banco de dados
const userRepository = AppDataSource.getRepository(User);

export class UserController {

    
    // Método para criar um novo usuário no sistema
    async createUser(req: Request, res: Response): Promise<void> {
        // Extrai email e password do corpo da requisição
        const { email, password } = req.body;

        // Validação básica - verifica se email e password foram fornecidos
        if (!email || !password) {
            // Retorna erro 400 (Bad Request) se faltar algum campo
            res.status(400).json({ message: "Email and password are required." });
            return; // Encerra a execução do método
        }

        // Verifica se já existe um usuário com o mesmo email no banco de dados
        const existingUser = await userRepository.findOneBy({ email });

        // Se o usuário já existir, retorna erro 409 (Conflict)
        if (existingUser) {
            res.status(409).json({ message: "User with this email already exists." });
            return;
        }

        // Cria uma nova instância do modelo User com os dados recebidos
        const user = new User(email, password);

        try {
            // Tenta salvar o novo usuário no banco de dados
            const savedUser = await userRepository.save(user);
            
            // Se bem-sucedido, retorna status 201 (Created) com os dados do usuário
            res.status(201).json({ 
                message: "User created successfully.", 
                user: savedUser 
            });
        } catch (error) {
            // Em caso de erro inesperado, exibe o erro no console
            console.error("Error creating user:", error);
            
            // Retorna erro 500 (Internal Server Error) com mensagem genérica
            res.status(500).json({ message: "Internal server error." });
        }
    }

    // Método para autenticar um usuário (login)
    async loginUser(req: Request, res: Response): Promise<void> {
        // Extrai email e password do corpo da requisição
        const { email, password } = req.body;

        // Validação básica - verifica se ambos campos foram fornecidos
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required." });
            return;
        }

        try {
            // Busca o usuário no banco de dados pelo email
            const user = await userRepository.findOneBy({ email });

            // Se não encontrar o usuário, retorna erro 401 (Unauthorized)
            if (!user) {
                res.status(401).json({ message: "Credentials are invalid." });
                return;
            }

            // Compara a senha fornecida com o hash armazenado no banco
            // Usa bcrypt.compare para comparação segura
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // Se a senha não for válida, retorna erro 401 (Unauthorized)
            if (!isPasswordValid) {
                res.status(401).json({ message: "Credentials are invalid." });
                return;
            }

            const { password: _, ...userWithoutPassword } = user; // Remove a senha do objeto

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

            // Salva o token no cookie
            res.cookie("token", token, {
                httpOnly: true,                                 // Define o cookie como HttpOnly (não acessível via JavaScript)
                secure: process.env.NODE_ENV === "production",  // Define o cookie como seguro (só enviado via HTTPS em produção)
                sameSite: "none",                               // Define o cookie como None (padrão para cookies de terceiros)
                maxAge: 1000 * 60 * 60                          // 1 hora em ms
            });

            // Se tudo estiver correto, retorna sucesso (200) com os dados do usuário sem a senha
            res.status(200).json({ message: "Login successful.", user: userWithoutPassword });
        } catch (error) {
            // Em caso de erro inesperado, exibe o erro e retorna 500
            console.error("Error logging in user:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    // Método para fazer logout do usuário
    async logoutUser(req: Request, res: Response): Promise<void> {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful." });
    }

}