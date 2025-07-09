import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const taskController = new TaskController();
const router = Router();

// Rota para criar uma nova tarefa
router.post("/tasks", AuthMiddleware, taskController.createTask);

// Rota para obter todas as tarefas de um usuário
router.get("/tasks/user", AuthMiddleware, taskController.getTasksByUser);

// Rota para obter uma tarefa específica pelo ID
router.get("/tasks/:id", AuthMiddleware, taskController.getTaskById);

// Rota para atualizar o status de uma tarefa
router.put("/tasks/:id", AuthMiddleware, taskController.updateTask);

// Rota para deletar uma tarefa
router.delete("/tasks/:id", AuthMiddleware, taskController.deleteTask);

// Exporta o rotas para ser usado no server.ts
export default router;
