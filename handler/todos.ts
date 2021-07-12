import { Status, RouterContext } from "../deps.ts";
import { todoModel } from "../models/mod.ts";
import { handleError, handleOK, getParams } from "../middlewares/utils.ts";

export const getAll = async(ctx: RouterContext) => {
  const todos = await todoModel.getAll();

  ctx.response.status = Status.OK;
  ctx.response.body = {
    data: todos
  };
};

export const get = async(ctx: RouterContext) => {
  const params = await getParams(ctx);
  const [todos, error] = await todoModel.get(params);
  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, todos);
}

export const create = async(ctx: RouterContext) => {
  const params = await getParams(ctx);
  await todoModel.create(params);
  ctx.response.status = Status.OK;
  handleOK(ctx, "success");
}

export const update = async(ctx: RouterContext) => {
  const params = await getParams(ctx);
  const [_, error] = await todoModel.update(params);

  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, "success");
}

export const remove = async(ctx: RouterContext) => {
  const params = await getParams(ctx);
  const [_, error] = await todoModel.remove(params);

  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, "success");
}
