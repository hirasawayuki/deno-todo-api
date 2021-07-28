import { assertEquals, testing } from "../test_deps.ts";
import { RootHandler } from "./mod.ts";
import { RouterContext, Status } from "../deps.ts";

const handler = new RootHandler();

Deno.test({
  name: "GET /v1",
  fn() {
    const ctx = testing.createMockContext({ path: "/v1" });
    const mw = (ctx: RouterContext): unknown => handler.getHome(ctx);
    mw(ctx);

    assertEquals(ctx.response.body, {message: "Todo API with deno."});
    assertEquals(ctx.response.status, Status.OK);
  },
});
