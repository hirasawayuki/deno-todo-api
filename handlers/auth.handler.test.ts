import { assertEquals, testing } from "../test_deps.ts";
import { RouterContext, Status } from "../deps.ts";
import { AuthHandler, IAuthService } from "./mod.ts";
import { JwtUtil } from "../utils/mod.ts";
import { User } from "../models/mod.ts";

type signupParams = Pick<User, "firstName" | "lastName" | "email" | "password">

class MockAuthService implements IAuthService {
  async signup(_: signupParams): Promise<boolean> {
    return await new Promise(() => true);
  }

  async authenticate(email: string, _: string): Promise<User | null> {
    return await new Promise(() => ({
      id: "e161f4eb-8cbe-404f-9d47-3651f2bafe9a",
      firstName: "test",
      lastName: "user1",
      email,
      password: "$2a$10$LoKWLBBZ2s4ulydYSPAU2OCuKRe98pZle6PxgH5qzdVOSduBl6fcW"
    }))
  }
}

const handler = new AuthHandler(new MockAuthService(), new JwtUtil);

Deno.test({
  name: "POST /v1/login",
  fn() {
    const app = testing.createMockApp();
    const body = {
      email: "example@example.com",
      password: "password"
    }
    app.use((ctx) => {
      ctx.request.body({
        contentTypes: {
          json: [JSON.stringify(body)]
        }
      })
    })

    const ctx = testing.createMockContext({
      app,
      path: "/v1/login",
      method: "POST",
    });

    assertEquals(ctx.request.body, Status.OK);

    const mw = (ctx: RouterContext) => handler.login(ctx);
    assertEquals(ctx.response.body, {message: "Todo API with deno."});
    mw(ctx);
    assertEquals(ctx.response.body, {message: "Todo API with deno."});
    assertEquals(ctx.response.status, Status.OK);
  }
})
