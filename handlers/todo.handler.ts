import { RouterContext, Status } from "../deps.ts";
import { Todo } from "../models/mod.ts";

interface JwtUtil {
  userId(jwt: string): Promise<string>;
}

type updateParams = Partial<Todo> & Pick<Todo, "id">

interface ITodoService {
  get(id: string): Promise<Todo | null>;
  getAll(userId: string): Promise<Todo[]>;
  register(userId: string, title: string): Promise<boolean>;
  update(params: updateParams): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}

export class TodoHandler {
  constructor(
    private todoService: ITodoService,
    private jwtUtil: JwtUtil,
  ) {
  }

  async getAll({cookies, response}: RouterContext): Promise<void> {
    const jwt = cookies.get("jwt") || "";
    const userId = await this.jwtUtil.userId(jwt);
    const todos = await this.todoService.getAll(userId);
    response.status = Status.OK;
    response.body = {
      todos,
    };
  }

  async get(ctx: RouterContext): Promise<void> {
    const { id } = ctx.params;
    if (id === "" || id === undefined) {
      console.log("id parameter does not exist")
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: "id parameter does not exist"
      };
      return;
    }

    const todo = await this.todoService.get(id);
    if (!todo) {
      console.log("todo was not found")
      ctx.response.status = Status.NotFound;
      ctx.response.body = {
        message: "todo was not found"
      };
      return
    }

    ctx.response.status = Status.OK;
    ctx.response.body = {
      todo,
    };
  }

  async create(ctx: RouterContext): Promise<void> {
    const jwt = ctx.cookies.get("jwt") || ""
    let userId = "";
    try {
      userId = await this.jwtUtil.userId(jwt);
    } catch(e) {
      console.log(e);
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: e,
      };
      return
    }

    const { title } = await this.getParams(ctx);
    if (title === undefined || title === "") {
      console.log("title is empty")
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: "failed to create todo. title is required",
      };
      return
    }
    const result = await this.todoService.register(userId, title);
    if (!result) {
      console.log("failed to register todo")
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: "failed to register todo",
      };
      return
    }

    ctx.response.status = Status.OK;
    ctx.response.body = {
      message: "register todo successful",
    };
  }

  async update(ctx: RouterContext): Promise<void> {
    const params = await this.getParams(ctx);
    const result = await this.todoService.update(params);

    if (!result) {
      console.log("failed to update todo")
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: "failed to update todo",
      };
      return;
    }

    ctx.response.status = Status.OK;
    ctx.response.body = {
      message: "update todo successful",
    };
  }

  async remove(ctx: RouterContext): Promise<void> {
    const { id } = await this.getParams(ctx);
    const result = await this.todoService.remove(id);

    if (!result) {
      console.log("failed to remove todo")
      ctx.response.body = {
        message: "failed to remove todo",
      };
      return;
    }

    ctx.response.status = Status.OK;
    ctx.response.body = {
      message: "remove todo successful",
    };
  }

  private async getParams(ctx: RouterContext): Promise<updateParams> {
    const result = ctx.request.body();
    const value = await result.value;
    return {
      ...ctx.params,
      ...value,
    };
  }

}
