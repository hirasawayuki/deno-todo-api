import { RouterContext } from "../deps.ts";
import { Todo } from "../models/mod.ts";
import { IJwtUtil } from "./mod.ts";
import {
  handleBadRequest,
  handleNotFound,
  handleOK,
} from "./handle_response.ts";

type todoParams = Partial<Todo> & Pick<Todo, "id">;

interface ITodoService {
  get(id: string): Promise<Todo | null>;
  getAll(userId: string): Promise<Todo[]>;
  register(userId: string, title: string): Promise<boolean>;
  update(params: todoParams): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}

export class TodoHandler {
  constructor(
    private todoService: ITodoService,
    private jwtUtil: IJwtUtil,
  ) {
  }

  async getAll(ctx: RouterContext): Promise<void> {
    const jwt = ctx.cookies.get("jwt") || "";
    const userId = await this.jwtUtil.userId(jwt);
    const todos = await this.todoService.getAll(userId);

    handleOK(ctx, { todos: todos });
  }

  async get(ctx: RouterContext): Promise<void> {
    const { id } = ctx.params;

    if (id === "" || id === undefined) {
      handleBadRequest(ctx, "id parameter does not exist");
      return;
    }

    const todo = await this.todoService.get(id);
    if (!todo) {
      handleNotFound(ctx, "todo was not found");
      return;
    }

    handleOK(ctx, { todo: todo });
  }

  async create(ctx: RouterContext): Promise<void> {
    const jwt = ctx.cookies.get("jwt") || "";
    let userId = "";
    try {
      userId = await this.jwtUtil.userId(jwt);
    } catch (error) {
      handleBadRequest(ctx, error);
      return;
    }

    const { title } = await this.getParams(ctx);
    if (title === undefined || title === "") {
      handleBadRequest(ctx, "failed to create todo. title is required");
      return;
    }

    const result = await this.todoService.register(userId, title);
    if (!result) {
      handleBadRequest(ctx, "failed to register todo");
      return;
    }

    handleOK(ctx, { message: "register todo successful" });
  }

  async update(ctx: RouterContext): Promise<void> {
    const params = await this.getParams(ctx);
    const result = await this.todoService.update(params);

    if (!result) {
      handleBadRequest(ctx, "failed to update todo");
      return;
    }

    handleOK(ctx, { message: "update todo successful" });
  }

  async remove(ctx: RouterContext): Promise<void> {
    const { id } = await this.getParams(ctx);
    const result = await this.todoService.remove(id);

    if (!result) {
      handleBadRequest(ctx, "failed to remove todo");
      return;
    }

    handleOK(ctx, { message: "remove todo successful" });
  }

  private async getParams(ctx: RouterContext): Promise<todoParams> {
    const result = ctx.request.body();
    const value = await result.value;
    return {
      ...ctx.params,
      ...value,
    };
  }
}
