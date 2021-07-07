import { Status, RouterContext } from "../deps.ts";

export const getHome = (ctx: RouterContext) => {
  ctx.response.status = Status.OK;
  ctx.response.body = "Todo list API with dino.";
};
