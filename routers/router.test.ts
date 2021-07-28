import { assertEquals, testing } from "../test_deps.ts";
import { router } from "./router.ts";

const mw = router.routes();

Deno.test({
  name: "router test",
  async fn() {
    const ctx = testing.createMockContext({
      path: "/v1",
    });

    const next = testing.createMockNext();
    await mw(ctx, next);

    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, {message: "Todo API with deno."});
  },
});
