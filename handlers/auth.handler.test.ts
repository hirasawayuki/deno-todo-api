import { RouterContext, Status, Request, Cookies } from "../deps.ts";
import { assertEquals, testing} from "../test_deps.ts";
import { createMockServerRequest } from "../test_util.ts";
import { AuthHandler } from "./mod.ts";
import { JwtUtil } from "../utils/mod.ts";
import {AuthService } from "../services/mod.ts";
import { UserRepository } from "../repositories/mod.ts";
import { User } from "../models/mod.ts";

const userRepository = new UserRepository();
const handler = new AuthHandler(new AuthService(userRepository), new JwtUtil());

const setup = async () => {
  const user  = {
    id: "e161f4eb-8cbe-404f-9d47-3651f2bafe9a",
    firstName: "testuser1",
    lastName: "testuser1",
    email: "example@example.com",
    password: "$2a$10$LoKWLBBZ2s4ulydYSPAU2OCuKRe98pZle6PxgH5qzdVOSduBl6fcW"
  } as User
  await userRepository.create(user);
}

const tearDown = async () => {
  const encoder = new TextEncoder();
  Deno.remove("./db/users_test.json");
  await Deno.writeFile(
    "./db/users_test.json",
    encoder.encode(JSON.stringify([]))
  );
}

const wrapFn = async (fn: () => void | Promise<void>): Promise<void> => {
  await setup();
  await fn();
  await tearDown();
}

Deno.test({
  name: "POST /v1/signup",
  fn: async () => await wrapFn(async () => {
    const ctx = testing.createMockContext({ path: "/v1/signup" });
    const serverRequest = createMockServerRequest(
      {
        method: "POST",
        headerValues: { "content-type": "application/json" },
        body: JSON.stringify({ firstName: "signuptest", lastName: "signuptest", email: "signup@example.com", password: "password" }),
      }
    );
    ctx.request = new Request(serverRequest);
    ctx.cookies = new Cookies(ctx.request, ctx.response);
    const mw = (ctx: RouterContext) => handler.signup(ctx);
    await mw(ctx);
    assertEquals(ctx.response.status, Status.OK);
    assertEquals(ctx.response.body, {message: "signup successful"});
  })
})

Deno.test({
  name: "POST /v1/login",
  fn: async () => await wrapFn(async () => {
    const ctx = testing.createMockContext({ path: "/v1/login" });
    const serverRequest = createMockServerRequest(
      {
        method: "POST",
        headerValues: { "content-type": "application/json" },
        body: JSON.stringify({ email: "example@example.com", password: "password" }),
      }
    );
    ctx.request = new Request(serverRequest);
    ctx.cookies = new Cookies(ctx.request, ctx.response);
    const mw = (ctx: RouterContext) => handler.login(ctx);
    await mw(ctx);
    assertEquals(ctx.response.status, Status.OK);
    assertEquals(ctx.response.body, {message: "login successful"});
  })
})

Deno.test({
  name: "POST /v1/logout",
  fn: async () => await wrapFn(() => {
    const ctx = testing.createMockContext({ path: "/v1/logout" });
    const serverRequest = createMockServerRequest(
      {
        method: "POST",
      }
    );
    ctx.request = new Request(serverRequest);
    ctx.cookies = new Cookies(ctx.request, ctx.response);
    const mw = (ctx: RouterContext) => handler.logout(ctx);
    mw(ctx);
    assertEquals(ctx.response.status, Status.OK);
    assertEquals(ctx.response.body, {message: "logout successful"});
  })
})
