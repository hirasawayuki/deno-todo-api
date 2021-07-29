import { assertEquals, testing } from "../test_deps.ts";
import { createMockServerRequest } from "../test_util.ts";
import { TodoHandler } from "./mod.ts";
import { TodoRepository } from "../repositories/mod.ts";
import { TodoService } from "../services/mod.ts";
import { Cookies, RouterContext, Request } from "../deps.ts";

class MockJwtUtil {
  async userId(_: string): Promise<string> {
    return await new Promise((resolve) =>
      resolve("e161f4eb-8cbe-404f-9d47-3651f2bafe9a")
    );
  }
  async verify(_: string): Promise<boolean> {
    return await new Promise((resolve) => resolve(true));
  }
  async create(_: string): Promise<string> {
    return await new Promise((resolve) =>
      resolve("e161f4eb-8cbe-404f-9d47-3651f2bafe9a")
    );
  }
}

const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoHandler = new TodoHandler(
  todoService,
  new MockJwtUtil(),
);

const encoder = new TextEncoder();

const setup = async () => {
  const todos = [
    {
      id: "0e74a05b-b1e5-4dfd-a879-69b6edd21154",
      userId: "e161f4eb-8cbe-404f-9d47-3651f2bafe9a",
      done: false,
      title: "todo1",
      createdAt: "2021-07-17T11:32:06.066Z",
      updatedAt: "2021-07-17T11:32:06.066Z"
    },
    {
      id: "9e4b9cd6-5274-4a41-bf5e-792b47681266",
      userId: "e161f4eb-8cbe-404f-9d47-3651f2bafe9a",
      done: false,
      title: "todo2",
      createdAt: "2021-07-17T11:32:06.066Z",
      updatedAt: "2021-07-17T11:32:06.066Z"
    },
    {
      id: "5d11b63e-e96c-4798-823b-b0ccda0e8912",
      userId: "9fe9f6f8-44bf-481a-bbc9-4573a62f642d",
      done: false,
      title: "other user todo",
      createdAt: "2021-07-17T11:32:42.340Z",
      updatedAt: "2021-07-17T11:32:42.340Z"
    }
  ];

  await Deno.writeFile("./db/todos_test.json", encoder.encode(JSON.stringify(todos)));
};

const tearDown = async () => {
  await Deno.writeFile(
    "./db/todos_test.json",
    encoder.encode(JSON.stringify([])),
  );
};

Deno.test({
  name: "GET /v1/todos",
  async fn() {
    await setup();
    const ctx = testing.createMockContext({
      path: "/v1/todos",
    });
    ctx.cookies = new Cookies(ctx.request, ctx.response);
    const mw = (ctx: RouterContext) => todoHandler.getAll(ctx);
    await mw(ctx);

    const body = JSON.parse(JSON.stringify(ctx.response.body));
    const todos = body.todos;
    const actual = todos[0];
    const expected = {
      id: "0e74a05b-b1e5-4dfd-a879-69b6edd21154",
      userId: "e161f4eb-8cbe-404f-9d47-3651f2bafe9a",
      done: false,
      title: "todo1",
      createdAt: "2021-07-17T11:32:06.066Z",
      updatedAt: "2021-07-17T11:32:06.066Z",
    };
    assertEquals(ctx.response.status, 200);
    assertEquals(todos.length, 2);
    assertEquals(actual, expected);
    await tearDown();
  }
});

Deno.test({
  name: "GET /v1/todos/:id",
  async fn() {
    await setup();
    const ctx = testing.createMockContext({
      path: "/v1/todos/0e74a05b-b1e5-4dfd-a879-69b6edd21154",
      params: { id: "0e74a05b-b1e5-4dfd-a879-69b6edd21154" },
    });

    const mw = (ctx: RouterContext) => todoHandler.get(ctx);
    await mw(ctx);
    const actual = JSON.parse(JSON.stringify(ctx.response.body));
    const expected = {
      todo: {
        id: "0e74a05b-b1e5-4dfd-a879-69b6edd21154",
        userId: "e161f4eb-8cbe-404f-9d47-3651f2bafe9a",
        done: false,
        title: "todo1",
        createdAt: "2021-07-17T11:32:06.066Z",
        updatedAt: "2021-07-17T11:32:06.066Z",
      },
    };
    assertEquals(ctx.response.status, 200);
    assertEquals(actual, expected);
    await tearDown();
  },
});

Deno.test({
  name: "POST /v1/todos",
  async fn() {
    await setup();
    const ctx = testing.createMockContext({ path: "/v1/todos" });
    const serverRequest = createMockServerRequest(
      {
        method: "POST",
        headerValues: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "create test"
        }),
      },
    );

    ctx.request = new Request(serverRequest);
    ctx.cookies = new Cookies(ctx.request, ctx.response);
    const mw = (ctx: RouterContext) => todoHandler.create(ctx);
    await mw(ctx);
    const actual = JSON.parse(JSON.stringify(ctx.response.body));
    assertEquals(ctx.response.status, 200);
    assertEquals(actual.message, "register todo successful");
    const todos = await todoService.getAll("e161f4eb-8cbe-404f-9d47-3651f2bafe9a");
    assertEquals(todos.length, 3);
    assertEquals(todos[2].userId, "e161f4eb-8cbe-404f-9d47-3651f2bafe9a");
    assertEquals(todos[2].title, "create test");
    await tearDown();
  },
});

Deno.test({
  name: "PUT /v1/todos/:id",
  async fn() {
    await setup();
    const ctx = testing.createMockContext({ path: "/v1/todos/:id" });
    const serverRequest = createMockServerRequest(
      {
        method: "PUT",
        headerValues: { "content-type": "application/json" },
        body: JSON.stringify({
          id: "9e4b9cd6-5274-4a41-bf5e-792b47681266",
          title: "update test",
          done: true
        }),
      },
    );

    ctx.request = new Request(serverRequest);
    ctx.cookies = new Cookies(ctx.request, ctx.response);
    const mw = (ctx: RouterContext) => todoHandler.update(ctx);
    await mw(ctx);
    const actual = JSON.parse(JSON.stringify(ctx.response.body));
    assertEquals(ctx.response.status, 200);
    assertEquals(actual.message, "update todo successful");
    const todo = await todoService.get("9e4b9cd6-5274-4a41-bf5e-792b47681266");
    assertEquals(todo?.title, "update test");
    assertEquals(todo?.done, true);
    await tearDown();
  },
});

Deno.test({
  name: "DELETE /v1/todos/:id",
  async fn() {
    await setup();
    const ctx = testing.createMockContext({ path: "/v1/todos/:id" });
    const serverRequest = createMockServerRequest(
      {
        method: "DELETE",
        headerValues: { "content-type": "application/json" },
        body: JSON.stringify({
          id: "9e4b9cd6-5274-4a41-bf5e-792b47681266",
        })
      },
    );

    ctx.request = new Request(serverRequest);
    ctx.cookies = new Cookies(ctx.request, ctx.response);
    const mw = (ctx: RouterContext) => todoHandler.remove(ctx);
    await mw(ctx);
    const actual = JSON.parse(JSON.stringify(ctx.response.body));
    assertEquals(ctx.response.status, 200);
    assertEquals(actual.message, "remove todo successful");
    const todo = await todoService.get("9e4b9cd6-5274-4a41-bf5e-792b47681266");
    assertEquals(todo, null);
    await tearDown();
  },
});
