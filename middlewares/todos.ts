import { Status, RouterContext } from "../deps.ts";

export const getTodo = (ctx: RouterContext) => {
  ctx.response.status = Status.OK;
  ctx.response.body = "todo";
};
