import { Router } from "../deps.ts";
import { rootHandler, TodoHandler, AuthHandler } from "../handlers/mod.ts";
import { authMiddleware } from "../middlewares/mod.ts";
import { TodoRepository, UserRepository } from "../repositories/mod.ts";
import { JwtService } from "../service/mod.ts";
import { registerValidation, loginValidation } from "../validations/mod.ts";

export const router = new Router();

// Root
router.get("/api", rootHandler.getHome);

// Authenticate
const authHandler = new AuthHandler(new UserRepository(), new JwtService());
router.post('/api/signup',  registerValidation.RegisterValidation, (ctx) => authHandler.signup(ctx));
router.post('/api/login',  loginValidation.LoginValidation, (ctx) => authHandler.login(ctx));
router.post('/api/logout', (ctx) => authHandler.logout(ctx));

// User
router.get('/api/user', authMiddleware, (ctx) => authHandler.getUser(ctx));

// Todos
const todoHandler = new TodoHandler(new TodoRepository(), new JwtService());
router.get("/api/todos", authMiddleware, (ctx) => todoHandler.getAll(ctx));
router.get("/api/todos/:id", authMiddleware, (ctx) => todoHandler.get(ctx));
router.post("/api/todos", authMiddleware, (ctx) => todoHandler.create(ctx));
router.put("/api/todos/:id", authMiddleware, (ctx) => todoHandler.update(ctx));
router.delete("/api/todos/:id", authMiddleware, (ctx) =>todoHandler.remove(ctx));

