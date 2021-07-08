import { Router } from "./deps.ts";
import { rootHandler, todosHandler } from "./middlewares/mod.ts";

export const router = new Router();
router.get("/", rootHandler.getHome);
router.get("/todos", todosHandler.getTodos);

