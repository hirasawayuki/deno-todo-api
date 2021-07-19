import { assertEquals, testing } from "../test_deps.ts";
import { TodoHandler } from "./todo.handler.ts";
import { TodoRepository } from "../repositories/todo.repository.ts";
import { RouterContext } from "../deps.ts";

class MockService {
  async userId(_: RouterContext): Promise<string> {
    return await new Promise((resolve) => resolve("e161f4eb-8cbe-404f-9d47-3651f2bafe9a"));
  }
}

const todoHandler = new TodoHandler(new TodoRepository(), new MockService());

Deno.test({
  name: "GET /v1/todos",
  async fn() {
    const ctx = testing.createMockContext({
      path: "/v1/todos",
    });

    const mw = (ctx: RouterContext) => todoHandler.getAll(ctx);
    await mw(ctx);

    const body = JSON.parse(JSON.stringify(ctx.response.body));
    const todos = body.todos;
    const actual = todos[0];
    const expected = {
      id: "0e74a05b-b1e5-4dfd-a879-69b6edd21154",
      userId: "e161f4eb-8cbe-404f-9d47-3651f2bafe9a",
      done: false,
      title: "test todo1",
      createdAt: "2021-07-17T11:32:06.066Z",
      updatedAt: "2021-07-17T11:32:06.066Z"
    }
    assertEquals(ctx.response.status, 200);
    assertEquals(todos.length, 4);
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "GET /v1/todos/:id",
  async fn() {
    const ctx = testing.createMockContext({
      path: "/v1/todos/0e74a05b-b1e5-4dfd-a879-69b6edd21154",
      params: {id: "0e74a05b-b1e5-4dfd-a879-69b6edd21154"}
    });

    const mw = (ctx: RouterContext) => todoHandler.get(ctx);
    await mw(ctx);
    const actual = JSON.parse(JSON.stringify(ctx.response.body));
    const expected = {
      todo: {
        id: "0e74a05b-b1e5-4dfd-a879-69b6edd21154",
        userId: "e161f4eb-8cbe-404f-9d47-3651f2bafe9a",
        done: false,
        title: "test todo1",
        createdAt: "2021-07-17T11:32:06.066Z",
        updatedAt: "2021-07-17T11:32:06.066Z"
      }
    }
    assertEquals(ctx.response.status, 200);
    assertEquals(actual, expected);
  },
});
