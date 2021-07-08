import { Status, RouterContext } from "../deps.ts";
import { todoModel } from "../models/mod.ts";

export const getTodos = async(ctx: RouterContext) => {
  const todos = await todoModel.getAll();

  ctx.response.status = Status.OK;
  ctx.response.body = {
    data: todos
  };
};
