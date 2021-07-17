import { Router } from "../deps.ts";
import { rootHandler, TodoHandler, authHandler } from "../handlers/mod.ts";
import { registerValidation, loginValidation } from "../validations/mod.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { TodoRepository } from "../repositories/todo.repository.ts";
import { JwtService } from "../service/jwt.service.ts";

export const router = new Router();

const todoHandler = new TodoHandler(new TodoRepository(), new JwtService());

// Root
router.get("/api", rootHandler.getHome);

// Todos
router.get("/api/todos", authMiddleware, (ctx) => todoHandler.getAll(ctx));
router.get("/api/todos/:id", authMiddleware, (ctx) => todoHandler.get(ctx));
router.post("/api/todos", authMiddleware, (ctx) => todoHandler.create(ctx));
router.put("/api/todos/:id", authMiddleware, (ctx) => todoHandler.update(ctx));
router.delete("/api/todos/:id", authMiddleware, (ctx) =>todoHandler.remove(ctx));

// Registration
router.post('/api/register',  registerValidation.RegisterValidation, authHandler.Register);

// Authenticate
router.post('/api/login',  loginValidation.LoginValidation, authHandler.Login);
router.get('/api/user', authMiddleware, authHandler.Authenticate);
