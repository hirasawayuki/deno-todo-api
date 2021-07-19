import { assertEquals, testing } from "../test_deps.ts";
import { TodoHandler } from "./todo.handler.ts";
import { TodoRepository } from "../repositories/todo.repository.ts";
import { RouterContext } from "../deps.ts";

class MockService {
  async userId(): Promise<string> {
    return await new Promise(() => "e161f4eb-8cbe-404f-9d47-3651f2bafe9a");
  }
}

const todoHandler = new TodoHandler(new TodoRepository(), new MockService());
const mw = (ctx: RouterContext) => todoHandler.getAll(ctx);

Deno.test({
  name: "GET /v1/todos",
  async fn() {
    const ctx = testing.createMockContext({
      path: "/v1/todos",
    });

    await mw(ctx);

    const body = JSON.parse(JSON.stringify(ctx.response.body));
    const todos = body.todos;
    const todo = todos[0];

    assertEquals(ctx.response.status, 200);
    assertEquals(todos.length, 4);
    assertEquals(todo.id, "0e74a05b-b1e5-4dfd-a879-69b6edd21154");
    assertEquals(todo.userId, "e161f4eb-8cbe-404f-9d47-3651f2bafe9a");
    assertEquals(todo.title, "test todo1");
  },
});
