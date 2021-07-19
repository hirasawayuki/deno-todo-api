import { RouterContext, Status } from "../deps.ts";
import { getParams } from "../middlewares/utils.ts";
import { TodoRepository } from "../repositories/todo.repository.ts";

interface JwtService {
  userId(jwt: string):Promise<string>;
}

export class TodoHandler {
  constructor(
    private todoRepository: TodoRepository,
    private jwtService: JwtService,
  ) {
  }

  async getAll(ctx: RouterContext): Promise<void> {
    const userId = "e161f4eb-8cbe-404f-9d47-3651f2bafe9a";
    const todos = await this.todoRepository.findByUserId(userId);
    ctx.response.status = Status.OK;
    ctx.response.body = {
      todos,
    };
  }

  async get(ctx: RouterContext): Promise<void> {
    const { id } = await getParams(ctx);
    const [todo, error] = await this.todoRepository.find(id);
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
    const params = await getParams(ctx);
    const userId = await this.jwtService.userId(ctx.cookies.get("jwt") || "");
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
