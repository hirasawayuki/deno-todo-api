import { Router } from "../deps.ts";
import { rootHandler, todoHandler, authHandler } from "../handlers/mod.ts";
import { registerValidation, loginValidation } from "../validations/mod.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

export const router = new Router();
router.get("/api", rootHandler.getHome);
router.get("/api/todos", todoHandler.getAll);
router.get("/api/todos/:id", authMiddleware, todoHandler.get);
router.post("/api/todos", todoHandler.create);
router.put("/api/todos/:id", todoHandler.update);
router.delete("/api/todos/:id", todoHandler.remove);
router.post('/api/register',  registerValidation.RegisterValidation, authHandler.Register);
router.post('/api/login',  loginValidation.LoginValidation, authHandler.Login);
router.get('/api/user', authMiddleware, authHandler.Authenticate);
