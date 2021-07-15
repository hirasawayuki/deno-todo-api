import { Status, RouterContext } from "../deps.ts";
import { handleError, handleOK, getParams } from "../middlewares/utils.ts";
import { TodoRepository } from "../repositories/todo.repository.ts";

export const getAll = async(ctx: RouterContext) => {
  const todoRepository = new TodoRepository();
  const todos = await todoRepository.getAll();

  ctx.response.status = Status.OK;
  ctx.response.body = {
    data: todos
  };
};

export const get = async(ctx: RouterContext) => {
  const params = await getParams(ctx);
  const todoRepository = new TodoRepository();
  const [todos, error] = await todoRepository.get(params);
  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, todos);
}

export const create = async(ctx: RouterContext) => {
  const params = await getParams(ctx);
  const todoRepository = new TodoRepository();
  await todoRepository.create(params);
  ctx.response.status = Status.OK;
  handleOK(ctx, "success");
}

export const update = async(ctx: RouterContext) => {
  const params = await getParams(ctx);
  const todoRepository = new TodoRepository();
  const [_, error] = await todoRepository.update(params);

  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, "success");
}

export const remove = async(ctx: RouterContext) => {
  const params = await getParams(ctx);
  const todoRepository = new TodoRepository();
  const [_, error] = await todoRepository.remove(params);

  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, "success");
}
