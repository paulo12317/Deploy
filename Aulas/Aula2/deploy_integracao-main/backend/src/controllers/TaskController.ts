import { Request, Response } from "express";            // Tipos do Express para requisição e resposta
import AppDataSource from "../config/data-source";  // Configuração da conexão com o banco de dados
import { Task, TaskStatus } from "../models/Task";      // Modelo/entidade Task e enum TaskStatus
import { User } from "../models/User";                  // Modelo/entidade User

// Obtém os repositórios do TypeORM para as entidades Task e User
// Isso permite realizar operações de CRUD no banco de dados
const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);

export class TaskController {

    // Método para criar uma nova tarefa no sistema
    async createTask(req: Request, res: Response): Promise<void> {
        // Extrai os dados da requisição
        const { title, description, status } = req.body;

        // Obtém o ID do usuário autenticado a partir do token JWT
        const userId = req.user?.id;

        // Validação básica - título é obrigatório
        if (!title) {
            res.status(400).json({ message: "Title is required." });
            return;
        }

        try {
            // Busca o usuário pelo ID para associar à tarefa
            const user = await userRepository.findOneBy({ id: userId });

            // Se o usuário não existir, retorna erro 404
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }

            // Cria uma nova instância da tarefa
            const task = new Task(title, description, status);
            // Associa o usuário à tarefa
            task.user = user;

            // Salva a tarefa no banco de dados
            const savedTask = await taskRepository.save(task);
            
            // Retorna sucesso (201) com os dados da tarefa criada
            res.status(201).json({ 
                message: "Task created successfully.", 
                task: savedTask 
            });
        } catch (error) {
            // Em caso de erro inesperado, exibe o erro e retorna 500
            console.error("Error creating task:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    // Método para obter todas as tarefas de um usuário
    async getTasksByUser(req: Request, res: Response): Promise<void> {
        
        // Obtém o ID do usuário autenticado a partir do token JWT
        const userId = req.user?.id;

        try {
            // Busca todas as tarefas do usuário, incluindo os dados do usuário (join)
            const tasks = await taskRepository.find({
                where: { user: { id: userId } }, // Filtra por ID do usuário
                relations: ['user'] // Inclui os dados do usuário associado
            });

            // Retorna sucesso (200) e a lista de tarefas
            res.status(200).json(tasks);
        } catch (error) {
            // Em caso de erro inesperado, exibe o erro e retorna 500
            console.error("Error fetching tasks:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    // Método para obter uma tarefa específica pelo ID
    async getTaskById(req: Request, res: Response): Promise<void> {
        // Obtém o ID da tarefa dos parâmetros da rota
        const { id } = req.params;

        try {
            // Busca a tarefa pelo ID, incluindo os dados do usuário (join)
            const task = await taskRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['user']
            });

            // Se não encontrar a tarefa, retorna 404
            if (!task) {
                res.status(404).json({ message: "Task not found." });
                return;
            }

            // Retorna a tarefa encontrada
            res.status(200).json(task);
        } catch (error) {
            // Em caso de erro inesperado, exibe o erro e retorna 500
            console.error("Error fetching task:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    // Método para atualizar uma tarefa existente
    async updateTask(req: Request, res: Response): Promise<void> {
        // Obtém o ID da tarefa dos parâmetros da rota
        const { id } = req.params;
        // Obtém os dados para atualização do corpo da requisição
        const { title, description, status } = req.body;

        try {
            // Busca a tarefa pelo ID
            const task = await taskRepository.findOneBy({ id: parseInt(id) });

            // Se não encontrar, retorna 404
            if (!task) {
                res.status(404).json({ message: "Task not found." });
                return;
            }

            // Verifca se o usuário autenticado é o dono da tarefa
            const userId = req.user?.id;
            if (task.user.id !== userId) {
                res.status(403).json({ message: "You do not have permission to update this task." });
                return;
            }

            // Atualiza os campos se foram fornecidos (usando nullish coalescing '??')
            // Se o campo não for fornecido, mantém o valor atual
            // Isso evita que campos não fornecidos sejam alterados para null ou undefined
            task.title = title ?? task.title;
            task.description = description ?? task.description;

            // Valida e atualiza o status se for válido
            if (status && Object.values(TaskStatus).includes(status)) {
                task.status = status;
            }

            // Salva as alterações no banco de dados
            const updatedTask = await taskRepository.save(task);
            
            // Retorna a tarefa atualizada
            res.status(200).json({ 
                message: "Task updated successfully.", 
                task: updatedTask 
            });
        } catch (error) {
            // Em caso de erro inesperado, exibe o erro e retorna 500
            console.error("Error updating task:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }
    
    // Método para excluir uma tarefa
    async deleteTask(req: Request, res: Response): Promise<void> {
        // Obtém o ID da tarefa dos parâmetros da rota
        const { id } = req.params;

        try {
            // Busca a tarefa pelo ID
            const task = await taskRepository.findOneBy({ id: parseInt(id) });

            // Se não encontrar, retorna 404
            if (!task) {
                res.status(404).json({ message: "Task not found." });
                return;
            }

            // Verifica se o usuário autenticado é o dono da tarefa
            const userId = req.user?.id;
            if (task.user.id !== userId) {
                res.status(403).json({ message: "You do not have permission to delete this task." });
                return;
            }

            // Remove a tarefa do banco de dados
            await taskRepository.remove(task);
            
            // Retorna mensagem de sucesso
            res.status(200).json({ message: "Task deleted successfully." });
        } catch (error) {
            // Em caso de erro inesperado, exibe o erro e retorna 500
            console.error("Error deleting task:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }
}