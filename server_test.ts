import { testing,assertEquals } from "./test_deps.ts";
import { router } from "./routers/router.ts";

const mw = router.routes();

Deno.test({
  name: "/api test",
  async fn() {
    const ctx = testing.createMockContext({
      path: "/api",
    });

    const next = testing.createMockNext();
    await mw(ctx, next)

    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, "Todo list API with deno.");
  }
})
