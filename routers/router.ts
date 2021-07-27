import { Router } from "../deps.ts";
import {
  AuthHandler,
  RootHandler,
  TodoHandler,
  UserHandler,
} from "../handlers/mod.ts";
import { authMiddleware } from "../middlewares/mod.ts";
import { TodoService } from "../services/mod.ts";
import { TodoRepository, UserRepository } from "../repositories/mod.ts";
import { JwtUtil } from "../utils/mod.ts";
import { loginValidation, registerValidation } from "../validations/mod.ts";

export const router = new Router();

// Root
const rootHandler = new RootHandler();
router.get("/v1", (ctx) => rootHandler.getHome(ctx));

// Authenticate
const authHandler = new AuthHandler(new UserRepository(), new JwtUtil());
router.post(
  "/v1/signup",
  registerValidation.RegisterValidation,
  (ctx) => authHandler.signup(ctx),
);
router.post(
  "/v1/login",
  loginValidation.LoginValidation,
  (ctx) => authHandler.login(ctx),
);
router.post("/v1/logout", (ctx) => authHandler.logout(ctx));

// User
const userHandler = new UserHandler(new UserRepository(), new JwtUtil());
router.get("/v1/user", authMiddleware, (ctx) => userHandler.getUser(ctx));

// Todos
const todoHandler = new TodoHandler(new TodoService(new TodoRepository()), new JwtUtil());
router.get("/v1/todos", authMiddleware, (ctx) => todoHandler.getAll(ctx));
router.get("/v1/todos/:id", authMiddleware, (ctx) => todoHandler.get(ctx));
router.post("/v1/todos", authMiddleware, (ctx) => todoHandler.create(ctx));
router.put("/v1/todos/:id", authMiddleware, (ctx) => todoHandler.update(ctx));
router.delete(
  "/v1/todos/:id",
  authMiddleware,
  (ctx) => todoHandler.remove(ctx),
);
