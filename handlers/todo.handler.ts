import { RouterContext, Status } from "../deps.ts";
import { getParams } from "../middlewares/utils.ts";
import { TodoRepository } from "../repositories/todo.repository.ts";

interface JwtUtil {
  userId(jwt: string): Promise<string>;
}

export class TodoHandler {
  constructor(
    private todoRepository: TodoRepository,
    private jwtUtil: JwtUtil,
  ) {
  }

  async getAll({cookies, response}: RouterContext): Promise<void> {
    const jwt = cookies.get("jwt") || "";
    const userId = await this.jwtUtil.userId(jwt);
    const todos = await this.todoRepository.findByUserId(userId);
    response.status = Status.OK;
    response.body = {
      todos,
    };
  }

  async get(ctx: RouterContext): Promise<void> {
    const { id } = ctx.params;
    const [todo, error] = await this.todoRepository.find(id || "");
    if (error) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: error,
      };
      return;
    }
    ctx.response.status = Status.OK;
    ctx.response.body = {
      todo,
    };
  }

  async create(ctx: RouterContext): Promise<void> {
    const jwt = ctx.cookies.get("jwt") || ""
    const params = await getParams(ctx);
    const userId = await this.jwtUtil.userId(jwt);
    await this.todoRepository.create(params.title, userId);
    ctx.response.status = Status.OK;
    ctx.response.body = {
      message: "success",
    };
  }

  async update(ctx: RouterContext): Promise<void> {
    const params = await getParams(ctx);
    const [_, error] = await this.todoRepository.update(params);

    if (error) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: error,
      };
      return;
    }

    ctx.response.status = Status.OK;
    ctx.response.body = {
      message: "success",
    };
  }

  async remove(ctx: RouterContext): Promise<void> {
    const params = await getParams(ctx);
    const [_, error] = await this.todoRepository.remove(params);

    if (error) {
      ctx.response.body = {
        message: error,
      };
      return;
    }

    ctx.response.status = Status.OK;
    ctx.response.body = {
      message: "success",
    };
  }
}
