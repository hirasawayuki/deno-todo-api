import { Router } from "./deps.ts";
import { rootHandler, todosHandler } from "./handler/mod.ts";
import { Register } from "./controllers/auth.controller.ts";
import { RegisterValidation } from "./validations/register.validation.ts";

export const router = new Router();

router.get("/", rootHandler.getHome);
router.get("/todos", todosHandler.getAll);
router.get("/todos/:id", todosHandler.get);
router.post("/todos", todosHandler.create);
router.put("/todos/:id", todosHandler.update);
router.delete("/todos/:id", todosHandler.remove);
router.post('/api/register',  RegisterValidation, Register);
