import { uuid } from "../deps.ts";
import { fromMap, toMap } from "./utils.ts";
import { Todo } from "../models/todo.ts";

const FILE_PATH = Deno.env.get("DENO_ENV") === "test"
  ? "./db/todos_test.json"
  : "./db/todos.json";

export class TodoRepository {
  async find(id: string): Promise<[Todo | undefined, Error | undefined]> {
    const todos = await this.findAll();
    const todo = toMap(todos).get(id);
    if (!todo) {
      return [undefined, new Error("Cannot find todo")];
    }
    return [todo, undefined];
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    const data = await Deno.readFile(FILE_PATH);
    const decoder = new TextDecoder();
    const todos = JSON.parse(decoder.decode(data));
    return todos.filter((todo: Todo) => todo.userId == userId);
  }

  async create(
    title: string,
    userId: string,
  ): Promise<[boolean | undefined, Error | undefined]> {
    const todos = await this.findAll();
    const id = uuid.generate();
    const now = new Date().toISOString();

    try {
      this.updateAll([
        ...todos,
        {
          id,
          userId,
          done: false,
          title,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      return [true, undefined];
    } catch (e) {
      return [false, new Error(e)];
    }
  }

  async update(
    params: Partial<Todo> & Pick<Todo, "id">,
  ): Promise<[boolean | undefined, Error | undefined]> {
    const todos = await this.findAll();
    const todoMap = toMap(todos);
    const todo = todoMap.get(params.id);

    if (!todo) {
      return [undefined, new Error("Cannot find todo")];
    }

    try {
      todoMap.set(
        params.id,
        { ...todo, ...params, updatedAt: new Date().toISOString() },
      );
      this.updateAll(fromMap(todoMap));
      return [true, undefined];
    } catch (e) {
      return [false, new Error(e)];
    }
  }

  async remove(id: string): Promise<[boolean | undefined, Error | undefined]> {
    const todos = await this.findAll();
    const todoMap = toMap(todos);

    if (!todoMap.has(id)) {
      return [undefined, new Error("Cannot find item")];
    }

    todoMap.delete(id);
    this.updateAll(fromMap(todoMap));
    return [true, undefined];
  }

  private async findAll(): Promise<Todo[]> {
    const data = await Deno.readFile(FILE_PATH);
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(data));
  }

  private updateAll(todos: Todo[]): boolean {
    const encoder = new TextEncoder();
    Deno.writeFile(
      FILE_PATH,
      encoder.encode(JSON.stringify(todos, null, "\t")),
    );
    return true;
  }
}
