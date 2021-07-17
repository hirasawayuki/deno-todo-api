import { RouterContext } from "../deps.ts";
import { getParams, handleError, handleOK } from "../middlewares/utils.ts";
import { TodoRepository } from "../repositories/todo.repository.ts";
import { JwtService } from "../service/jwt.service.ts";

export class TodoHandler {
  constructor(
    private todoRepository: TodoRepository,
    private jwtService: JwtService,
  ) {
  }

  async getAll(ctx: RouterContext): Promise<void> {
    const userId = await this.jwtService.userId(ctx.cookies.get("jwt") || "");
    const todos = await this.todoRepository.findByUserId(userId);
    handleOK(ctx, todos);
  }

  async get(ctx: RouterContext): Promise<void> {
    const { id } = await getParams(ctx);
    const [todo, error] = await this.todoRepository.find(id);
    if (error) {
      return handleError(ctx, error);
    }
    handleOK(ctx, todo);
  }

  async create(ctx: RouterContext): Promise<void> {
    const params = await getParams(ctx);
    const userId = await this.jwtService.userId(ctx.cookies.get("jwt") || "");
    await this.todoRepository.create(params.title, userId);
    handleOK(ctx, "success");
  }

  async update(ctx: RouterContext): Promise<void> {
    const params = await getParams(ctx);
    const [_, error] = await this.todoRepository.update(params);

    if (error) {
      return handleError(ctx, error);
    }

    handleOK(ctx, "success");
  }

  async remove(ctx: RouterContext): Promise<void> {
    const params = await getParams(ctx);
    const [_, error] = await this.todoRepository.remove(params);

    if (error) {
      return handleError(ctx, error);
    }

    handleOK(ctx, "success");
  }
}
