import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const userController = new UserController();
const router = Router();

// Rota para criar um novo usuário
router.post("/users", userController.createUser);

// Rota para autenticar um usuário (login)
router.post("/login", userController.loginUser);

// Rota para deslogar um usuário (logout) com middleware de autenticação
// Esta rota deve ser protegida, pois o usuário precisa estar autenticado para deslogar
router.post("/logout", AuthMiddleware, userController.logoutUser);

// Exporta o rotas para ser usado no server.ts
export default router;
