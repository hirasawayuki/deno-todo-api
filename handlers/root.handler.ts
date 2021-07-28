import { RouterContext } from "../deps.ts";
import { handleOK } from "./handle_response.ts";

export class RootHandler {
  getHome(ctx: RouterContext): void {
    handleOK(ctx, { message: "Todo API with deno." });
  }
}
