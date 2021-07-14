import { Router } from "./deps.ts";
import { rootHandler, todosHandler, authHandler } from "./handlers/mod.ts";
import { registerValidation, loginValidation } from "./validations/mod.ts";

export const router = new Router();
router.get("/api", rootHandler.getHome);
router.get("/api/todos", todosHandler.getAll);
router.get("/api/todos/:id", todosHandler.get);
router.post("/api/todos", todosHandler.create);
router.put("/api/todos/:id", todosHandler.update);
router.delete("/api/todos/:id", todosHandler.remove);
router.post('/api/register',  registerValidation.RegisterValidation, authHandler.Register);
router.post('/api/login',  loginValidation.LoginValidation, authHandler.Login);
