import { Status, RouterContext } from "../deps.ts";

export class RootHandler {
  getHome(ctx: RouterContext): void {
    ctx.response.status = Status.OK;
    ctx.response.body = "Todo list API with dino.";
  }
}
